from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from datetime import datetime


app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Pranish@123',
    'database': 'library_db',
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_stats():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Get total books
    cursor.execute("SELECT SUM(quantity) as total FROM books")
    total_result = cursor.fetchone()
    total_books = int(total_result['total']) if total_result['total'] else 0
    
    # Get available books
    cursor.execute("SELECT SUM(available_qty) as available FROM books")
    avail_result = cursor.fetchone()
    available_books = int(avail_result['available']) if avail_result['available'] else 0
    
    # Issued books
    issued_books = total_books - available_books

    # This month activity count
    cursor.execute("""
        SELECT COUNT(*) as cnt FROM issued_books 
        WHERE MONTH(issue_date) = MONTH(CURRENT_DATE()) 
        AND YEAR(issue_date) = YEAR(CURRENT_DATE())
    """)
    month_result = cursor.fetchone()
    this_month = int(month_result['cnt']) if month_result['cnt'] else 0
    
    # Recent activity
    cursor.execute("""
        SELECT i.id, i.status as type, b.title as book, i.student_name as user, 
               i.issue_date as time, i.return_date
        FROM issued_books i 
        JOIN books b ON i.book_id = b.id 
        ORDER BY i.issue_date DESC LIMIT 10
    """)
    recent_activity = cursor.fetchall()
    
    # Serialize datetime objects
    for activity in recent_activity:
        if activity['time']:
            activity['time'] = activity['time'].strftime('%Y-%m-%d %H:%M:%S')
        if activity.get('return_date') and activity['return_date']:
            activity['return_date'] = activity['return_date'].strftime('%Y-%m-%d %H:%M:%S')
    
    cursor.close()
    conn.close()
    
    return jsonify({
        "stats": {
            "total_books": total_books,
            "available_books": available_books,
            "issued_books": issued_books,
            "this_month": this_month
        },
        "recent_activities": recent_activity
    })

@app.route('/api/books', methods=['GET'])
def get_books():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM books")
    books = cursor.fetchall()
    cursor.close()
    conn.close()
    
    result = []
    for book in books:
        result.append({
            'id': book['id'],
            'title': book['title'],
            'author': book['author'],
            'available': book['available_qty'] > 0,
            'quantity': book['quantity'],
            'available_qty': book['available_qty']
        })
    return jsonify(result)

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.json
    title = data.get('title')
    author = data.get('author')
    quantity = data.get('quantity', 1)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO books (title, author, quantity, available_qty) VALUES (%s, %s, %s, %s)",
        (title, author, quantity, quantity)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Book added successfully!"}), 201

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Check if any copies are currently issued
    cursor.execute("SELECT COUNT(*) as cnt FROM issued_books WHERE book_id = %s AND status = 'issued'", (book_id,))
    result = cursor.fetchone()
    
    if result['cnt'] > 0:
        cursor.close()
        conn.close()
        return jsonify({"message": "Cannot delete book with active issues. Return all copies first."}), 400
    
    try:
        # Delete related issued_books records first
        cursor.execute("DELETE FROM issued_books WHERE book_id = %s", (book_id,))
        cursor.execute("DELETE FROM books WHERE id = %s", (book_id,))
        conn.commit()
        return jsonify({"message": "Book deleted successfully!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/issue', methods=['POST'])
def issue_book():
    data = request.json
    student_name = data.get('student_name')
    book_id = data.get('book_id')
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Check if book is available
    cursor.execute("SELECT available_qty FROM books WHERE id = %s", (book_id,))
    book = cursor.fetchone()
    
    if not book or book['available_qty'] <= 0:
        cursor.close()
        conn.close()
        return jsonify({"message": "Book not available"}), 400
        
    try:
        cursor.execute("UPDATE books SET available_qty = available_qty - 1 WHERE id = %s", (book_id,))
        cursor.execute("INSERT INTO issued_books (book_id, student_name) VALUES (%s, %s)", (book_id, student_name))
        conn.commit()
        return jsonify({"message": "Book issued successfully!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/return', methods=['POST'])
def return_book():
    data = request.json
    issue_id = data.get('issue_id')
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Find the issued record
    cursor.execute("SELECT * FROM issued_books WHERE id = %s AND status = 'issued'", (issue_id,))
    record = cursor.fetchone()
    
    if not record:
        cursor.close()
        conn.close()
        return jsonify({"message": "No active issue found with this ID"}), 400
    
    try:
        cursor.execute("UPDATE issued_books SET status = 'returned', return_date = NOW() WHERE id = %s", (issue_id,))
        cursor.execute("UPDATE books SET available_qty = available_qty + 1 WHERE id = %s", (record['book_id'],))
        conn.commit()
        return jsonify({"message": "Book returned successfully!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/issued', methods=['GET'])
def get_issued_books():
    """Get all currently issued books for the Return Book page."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.id as issue_id, i.student_name, i.issue_date, i.status,
               b.id as book_id, b.title, b.author
        FROM issued_books i
        JOIN books b ON i.book_id = b.id
        WHERE i.status = 'issued'
        ORDER BY i.issue_date DESC
    """)
    issued = cursor.fetchall()
    
    for record in issued:
        if record['issue_date']:
            record['issue_date'] = record['issue_date'].strftime('%Y-%m-%d %H:%M:%S')
    
    cursor.close()
    conn.close()
    return jsonify(issued)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
