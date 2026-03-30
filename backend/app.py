from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Pranish@123',
    'database': 'library_db',
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def ensure_books_table():
    """Create books table and seed sample books if empty."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            available_qty INT NOT NULL
        )
    """)
    conn.commit()
    
    cursor.execute("SELECT COUNT(*) as cnt FROM books")
    if cursor.fetchone()['cnt'] == 0:
        sample_books = [
            ('The Great Gatsby', 'F. Scott Fitzgerald', 5, 5),
            ('To Kill a Mockingbird', 'Harper Lee', 3, 3),
            ('1984', 'George Orwell', 4, 4),
            ('Pride and Prejudice', 'Jane Austen', 2, 2)
        ]
        cursor.executemany(
            "INSERT INTO books (title, author, quantity, available_qty) VALUES (%s, %s, %s, %s)",
            sample_books
        )
        conn.commit()
    cursor.close()
    conn.close()

def ensure_requests_table():
    """Create book_requests table if it doesn't exist."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS book_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            book_id INT NOT NULL,
            user_id INT NOT NULL,
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            response_date TIMESTAMP NULL,
            FOREIGN KEY (book_id) REFERENCES books(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

def ensure_issued_books_table():
    """Create issued_books table if it doesn't exist."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS issued_books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            book_id INT NOT NULL,
            student_name VARCHAR(255) NOT NULL,
            issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            return_date TIMESTAMP NULL,
            status ENUM('issued', 'returned') DEFAULT 'issued',
            FOREIGN KEY (book_id) REFERENCES books(id)
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

def ensure_users_table():
    """Create users table if it doesn't exist."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'student') DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    
    # Seed default admin if no admin exists
    cursor.execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    if not cursor.fetchone():
        hashed = generate_password_hash('admin123')
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
            ('Admin', 'admin@library.com', hashed, 'admin')
        )
        conn.commit()
    
    cursor.close()
    conn.close()

# Auto-creation moved to main block for cleaner startup


# ─── AUTH ROUTES ───────────────────────────────────────────

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'student')
    
    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400
    
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400
    
    if role not in ('admin', 'student'):
        role = 'student'
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "Email already registered"}), 400
    
    try:
        hashed = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
            (name, email, hashed, role)
        )
        conn.commit()
        
        # Get the new user
        cursor.execute("SELECT id, name, email, role FROM users WHERE id = %s", (cursor.lastrowid,))
        user = cursor.fetchone()
        
        return jsonify({
            "message": "Account created successfully!",
            "user": user
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid email or password"}), 401
    
    return jsonify({
        "message": "Login successful!",
        "user": {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }
    })


# ─── DASHBOARD ─────────────────────────────────────────────

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_stats():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT SUM(quantity) as total FROM books")
    total_result = cursor.fetchone()
    total_books = int(total_result['total']) if total_result['total'] else 0
    
    cursor.execute("SELECT SUM(available_qty) as available FROM books")
    avail_result = cursor.fetchone()
    available_books = int(avail_result['available']) if avail_result['available'] else 0
    
    issued_books = total_books - available_books

    cursor.execute("SELECT COUNT(*) as cnt FROM book_requests WHERE status = 'pending'")
    pending_requests = cursor.fetchone()['cnt']

    cursor.execute("""
        SELECT COUNT(*) as cnt FROM issued_books 
        WHERE MONTH(issue_date) = MONTH(CURRENT_DATE()) 
        AND YEAR(issue_date) = YEAR(CURRENT_DATE())
    """)
    month_result = cursor.fetchone()
    this_month = int(month_result['cnt']) if month_result['cnt'] else 0
    
    cursor.execute("""
        SELECT i.id, i.status as type, b.title as book, i.student_name as user, 
               i.issue_date as time, i.return_date
        FROM issued_books i 
        JOIN books b ON i.book_id = b.id 
        ORDER BY i.issue_date DESC LIMIT 10
    """)
    recent_activity = cursor.fetchall()
    
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
            "this_month": this_month,
            "pending_requests": pending_requests
        },
        "recent_activities": recent_activity
    })


# ─── BOOKS ─────────────────────────────────────────────────

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
    
    cursor.execute("SELECT COUNT(*) as cnt FROM issued_books WHERE book_id = %s AND status = 'issued'", (book_id,))
    result = cursor.fetchone()
    
    if result['cnt'] > 0:
        cursor.close()
        conn.close()
        return jsonify({"message": "Cannot delete book with active issues. Return all copies first."}), 400
    
    try:
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


# ─── ISSUE / RETURN ────────────────────────────────────────

@app.route('/api/issue', methods=['POST'])
def issue_book():
    data = request.json
    student_name = data.get('student_name')
    book_id = data.get('book_id')
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
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

@app.route('/api/requests', methods=['GET'])
def get_requests():
    user_id = request.args.get('user_id')
    role = request.args.get('role')
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT r.*, b.title as book_title, b.author as book_author, u.name as student_name, u.email as student_email
        FROM book_requests r
        JOIN books b ON r.book_id = b.id
        JOIN users u ON r.user_id = u.id
    """
    
    if role == 'student' and user_id:
        query += " WHERE r.user_id = %s"
        cursor.execute(query + " ORDER BY r.request_date DESC", (user_id,))
    else:
        cursor.execute(query + " ORDER BY r.request_date DESC")
        
    reqs = cursor.fetchall()
    
    for r in reqs:
        if r['request_date']:
            r['request_date'] = r['request_date'].strftime('%Y-%m-%d %H:%M:%S')
        if r['response_date']:
            r['response_date'] = r['response_date'].strftime('%Y-%m-%d %H:%M:%S')
            
    cursor.close()
    conn.close()
    return jsonify(reqs)

@app.route('/api/requests', methods=['POST'])
def create_request():
    data = request.json
    book_id = data.get('book_id')
    user_id = data.get('user_id')
    
    if not book_id or not user_id:
        return jsonify({"message": "Missing book_id or user_id"}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Check if a pending request already exists for this book & user
    cursor.execute("SELECT id FROM book_requests WHERE book_id = %s AND user_id = %s AND status = 'pending'", (book_id, user_id))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "You already have a pending request for this book"}), 400
        
    cursor.execute("INSERT INTO book_requests (book_id, user_id) VALUES (%s, %s)", (book_id, user_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Request sent successfully!"}), 201

@app.route('/api/requests/<int:request_id>', methods=['PUT'])
def handle_request(request_id):
    data = request.json
    status = data.get('status') # 'approved' or 'rejected'
    
    if status not in ['approved', 'rejected']:
        return jsonify({"message": "Invalid status"}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Get request details
    cursor.execute("""
        SELECT r.*, u.name as student_name, b.available_qty, b.id as book_id
        FROM book_requests r
        JOIN users u ON r.user_id = u.id
        JOIN books b ON r.book_id = b.id
        WHERE r.id = %s AND r.status = 'pending'
    """, (request_id,))
    req = cursor.fetchone()
    
    if not req:
        cursor.close()
        conn.close()
        return jsonify({"message": "Request not found or already processed"}), 404
        
    try:
        if status == 'approved':
            # Check availability again
            if req['available_qty'] <= 0:
                return jsonify({"message": "Book no longer available"}), 400
                
            # Issue the book (reusing logic)
            cursor.execute("UPDATE books SET available_qty = available_qty - 1 WHERE id = %s", (req['book_id'],))
            cursor.execute("INSERT INTO issued_books (book_id, student_name) VALUES (%s, %s)", (req['book_id'], req['student_name']))
            
        cursor.execute("UPDATE book_requests SET status = %s, response_date = NOW() WHERE id = %s", (status, request_id))
        conn.commit()
        return jsonify({"message": f"Request {status} successfully!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    print("🚀 Starting Library Management System Backend...")
    try:
        ensure_books_table()
        ensure_users_table()
        ensure_requests_table()
        ensure_issued_books_table()
        print("✅ Database initialized successfully.")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        
    app.run(debug=True, port=5000)
