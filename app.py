from flask import Flask, request, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
import io
import csv
import os

app = Flask(__name__)
# Enable CORS so your frontend can talk to the backend
CORS(app, resources={r"/*": {"origins": "*"}})

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- DATABASE MODELS ---
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    parent_phone = db.Column(db.String(15), nullable=False)
    # Track multiple absence dates
    absences = db.relationship('Absence', backref='student', lazy=True, cascade="all, delete-orphan")

class Absence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)

with app.app_context():
    db.create_all()
    print("--- Database with Date Tracking Ready! ---")

# --- GUARANTEED EMAIL FUNCTION ---
def send_attendance_email(parent_email, student_name, total_days, date):
    # FORCE YOUR DETAILS HERE (NO NoneType ERRORS)
    sender_email = "chirudeepak7004@gmail.com"
    app_password = "efzgntrmacigcwvh"

    body = f"Dear Parent,\n\nYour child {student_name} is absent today ({date}).\nTotal absences this semester: {total_days}.\n\nRegards,\nFaculty Office"
    
    msg = MIMEText(body)
    msg['Subject'] = f"Absence Alert: {student_name}"
    msg['From'] = sender_email
    msg['To'] = parent_email

    try:
        # Standard Port 587 for Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() 
        server.login(sender_email, app_password)
        server.sendmail(sender_email, parent_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        # This will tell you EXACTLY why it fails in the terminal
        print(f"❌ Mail Error: {e}") 
        return False

# --- API ROUTES ---
@app.route('/add-student', methods=['POST'])
def add_student():
    data = request.json
    try:
        new_student = Student(name=data['name'], email=data['email'], parent_phone=data['parent_phone'])
        db.session.add(new_student)
        db.session.commit()
        return jsonify({"message": "Student Registered!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([{
        "id": s.id, "name": s.name, "email": s.email, 
        "parent_phone": s.parent_phone, "absent_count": len(s.absences)
    } for s in students])

@app.route('/send-absent-sms', methods=['POST'])
def handle_notification():
    data = request.json
    # Modern fetch to avoid warnings
    student = db.session.get(Student, data['id'])
    
    if student:
        today = datetime.now().strftime("%Y-%m-%d")
        new_absence = Absence(date=today, student_id=student.id)
        db.session.add(new_absence)
        db.session.commit()
        
        total = len(student.absences)
        success = send_attendance_email(student.email, student.name, total, today)
        
        if success:
            print(f"✅ Success: Email delivered to {student.email}")
            return jsonify({"message": f"Email sent for {today}!"})
        else:
            return jsonify({"error": "Mail Server Authentication Failed"}), 500
            
    return jsonify({"error": "Student not found"}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # This creates the .db file if it doesn't exist
    # Use 0.0.0.0 to allow access from other devices on your network
    app.run(host='0.0.0.0', port=5000, debug=True)
    @app.route('/')
def home():
    return {"status": "Backend is running successfully!"}