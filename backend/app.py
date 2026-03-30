from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector



app = Flask(__name__)
CORS(app) # Allow cross-origin requests from React

# Database configuration
# The user will need to adjust these in case they have a different password
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Pranish@123',
    'database': 'library_db',
    # 'auth_plugin': 'mysql_native_password'  <-- Try commenting this out
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
    
    # Recent activity
    cursor.execute("""
        SELECT i.id, i.status as type, b.title as book, i.student_name as user, i.issue_date as time 
        FROM issued_books i 
        JOIN books b ON i.book_id = b.id 
        ORDER BY i.issue_date DESC LIMIT 5
    """)
    recent_activity = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify({
        "stats": {
            "total_books": total_books,
            "available_books": available_books,
            "issued_books": issued_books,
            "this_month": recent_activity.__len__() # simplified
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
    
    # Transform to match frontend format
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
        # Decrease available qty
        cursor.execute("UPDATE books SET available_qty = available_qty - 1 WHERE id = %s", (book_id,))
        # Insert into issued_books
        cursor.execute("INSERT INTO issued_books (book_id, student_name) VALUES (%s, %s)", (book_id, student_name))
        conn.commit()
        return jsonify({"message": "Book issued successfully!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
