Node.js User Registration Server
A simple HTTP server built with Node.js that handles user registration, stores data in a JSON file, and serves multiple web pages.

🚀 Features
User Registration Form - Collects first name, last name, and password

File-based Storage - Stores user data in users.json using Node.js fs module

Multiple Routes - Home, About, Dashboard, and Registration endpoints

Form Validation - Basic input validation and error handling

Beautiful UI - Responsive design with CSS styling

Error Handling - Custom 404 pages and error responses

📁 Project Structure

project/
├── server.js          # Main server file
├── users.json         # User data storage (auto-created)
└── README.md          # This file

🛠️ Installation & Setup
Clone or create the project directory

bash
mkdir node-server
cd node-server
Create the server file

bash
# Copy the server.js code into this file
Install Node.js (if not already installed)

Download from nodejs.org

Or use a version manager like nvm

Run the server

bash
node server.js
🌐 Available Routes
Route	Method	Description
/	GET	Home page with registration form
/about	GET	About page
/dashboard	GET	Dashboard page
/submit	POST	Handles form submissions
Any other route	GET	404 Not Found page
📊 Data Storage
User data is stored in users.json with the following format:

json
[
  {
    "id": 1704038400000,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "plaintext_password",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "ip": "::ffff:127.0.0.1"
  }
]
⚠️ Security Note: Passwords are stored in plaintext for demonstration purposes only. In production, always hash passwords using bcrypt or similar libraries.

🎯 Usage
Starting the Server
bash
node server.js
Testing the Application
Open your browser to http://localhost:3000

Fill out the registration form with:

First Name

Last Name

Password (min 6 characters)

Submit the form to see success message

Explore other pages:

http://localhost:3000/about

http://localhost:3000/dashboard

Testing with curl
bash
# Test form submission
curl -X POST http://localhost:3000/submit \
  -d "firstName=John&lastName=Doe&password=secret123" \
  -H "Content-Type: application/x-www-form-urlencoded"
🔧 Technical Details
Dependencies
Node.js - JavaScript runtime

fs module - File system operations (built-in)

http module - HTTP server functionality (built-in)

Server Configuration
Port: 3000

Content Type: text/html

Storage: JSON file (users.json)

Encoding: UTF-8

Error Handling
404 responses for unknown routes

Form validation errors

File system operation errors

JSON parsing errors

🎨 UI Features
Responsive design that works on desktop and mobile

Clean, modern styling with CSS

User-friendly forms with validation

Navigation menu between pages

Success/error messages with icons

Consistent styling across all pages

📝 Code Structure
The server uses:

HTTP module for creating the server

URLSearchParams for parsing form data

fs module for file operations

Template literals for HTML generation

CSS-in-JS for styling

🔍 Debugging
View server logs in the terminal:

Form submissions

User registrations

Error messages

Request headers

🚨 Important Notes
Password Security: This is a demo - never store plaintext passwords in production!

File Storage: JSON files are not suitable for production databases

Validation: Add more robust validation for production use

Error Handling: Enhance error handling for production environments

📈 Next Steps
For production use, consider adding:

Password hashing with bcrypt

Database integration (MongoDB, PostgreSQL, etc.)

User authentication sessions

Email verification

Input sanitization

Rate limiting

HTTPS encryption

Environment variables for configuration

🤝 Contributing
This is a demonstration project. Feel free to:

Add new features

Improve the UI/UX

Enhance security

Add tests

Improve documentation
