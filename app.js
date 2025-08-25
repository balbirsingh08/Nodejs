const http = require('http');
const fs = require("fs");
const server = http.createServer(reqestserver);
const PORT = 3000
const USERS_FILE = "users.json";
// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
function sendSuccessResponse(res, user) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Registration Successful</title>
      <style>
        body { font-family: Arial; background: #f0f8ff; text-align: center; }
        .container { max-width: 600px; margin: 40px auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
        .success { font-size: 4rem; color: green; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success">✅</div>
        <h1>Registration Successful!</h1>
        <p><b>Name:</b> ${user.firstName} ${user.lastName}</p>
        ${user.email ? `<p><b>Email:</b> ${user.email}</p>` : ""}
        <p><b>User ID:</b> ${user.id}</p>
        <p><b>Registered:</b> ${new Date(user.createdAt).toLocaleString()}</p>
        <a href="/">Register Another User</a>
      </div>
    </body>
    </html>
  `);
}

// ❌ Error Page
function sendErrorResponse(res, message) {
  res.writeHead(400, { "Content-Type": "text/html" });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head><title>Error</title></head>
    <body style="font-family:Arial;text-align:center;background:#fee">
      <h1 style="color:red">❌ Registration Failed</h1>
      <p>${message}</p>
      <a href="/">Go Back</a>
    </body>
    </html>
  `);
}

function reqestserver(req , res){ // Set content type header
    res.setHeader('Content-Type', 'text/html');
  
  // Route handling
  if (req.url === '/') {
    // Home page with user input form
    
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Home - User Registration</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px;
            background: #f0f8ff;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
          }
          h1 { 
            color: #2c3e50; 
            text-align: center;
            margin-bottom: 30px;
          }
          .nav { 
            margin: 20px 0; 
            text-align: center;
          }
          .nav a {
            color: #3498db;
            text-decoration: none;
            margin: 0 15px;
            font-weight: bold;
          }
          .nav a:hover { 
            text-decoration: underline; 
          }
          .form-group {
            margin-bottom: 20px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            color: #34495e;
            font-weight: bold;
          }
          input[type="text"],
          input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
          }
          input[type="text"]:focus,
          input[type="password"]:focus {
            border-color: #3498db;
            outline: none;
          }
          button {
            width: 100%;
            padding: 12px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
          }
          button:hover {
            background: #2980b9;
          }
          .form-row {
            display: flex;
            gap: 15px;
          }
          .form-row .form-group {
            flex: 1;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="nav">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          
          <h1>User Registration</h1>
          
          <form action="/submit" method="POST">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" required 
                       placeholder="Enter your first name">
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" required 
                       placeholder="Enter your last name">
              </div>
            </div>
            
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required 
                     placeholder="Enter your password" minlength="6">
            </div>
            
            <button type="submit">Register</button>
          </form>
          
          <p style="text-align: center; margin-top: 20px; color: #666;">
            Already have an account? <a href="/login" style="color: #3498db;">Login here</a>
          </p>
        </div>
      </body>
      </html>
    `);
}else if (req.url === '/about') {
    // About page
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>About Us</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px;
            background: #fff0f5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 { color: #8e44ad; }
          p { color: #2c3e50; line-height: 1.6; }
          .nav { margin: 20px 0; }
          .nav a {
            color: #9b59b6;
            text-decoration: none;
            margin-right: 15px;
          }
          .nav a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="nav">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/dashboard">Dashborad</a>
          </div>
          <h1>About Our Home</h1>
          <p>This is a simple web page about our home. We love creating comfortable and beautiful spaces!</p>
          <p>Our mission is to make every space feel like home - warm, welcoming, and full of love.</p>
        </div>
      </body>
      </html>
    `);
  } else if (req.url === '/dashboard') {
    // Dashboard page
  res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>About Us</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px;
            background: #fff0f5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 { color: #8e44ad; }
          p { color: #2c3e50; line-height: 1.6; }
          .nav { margin: 20px 0; }
          .nav a {
            color: #9b59b6;
            text-decoration: none;
            margin-right: 15px;
          }
          .nav a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="nav">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          <h1>Dashboard </h1>
          <p>This is a simple web page about our Dashboard. We love creating comfortable and beautiful spaces!</p>
          <p>Our mission is to make every space feel like home - warm, welcoming, and full of love.</p>
        </div>
      </body>
      </html>
    `);
  }
else if (req.url === "/submit" && req.method === "POST") {
  let body = "";
  req.on("data", chunk => (body += chunk.toString()));
  req.on("end", () => {
    try {
      const params = new URLSearchParams(body);
      const user = {
        id: Date.now(),
        firstName: params.get("firstName"),
        lastName: params.get("lastName"),
        email: params.get("email") || "",
        password: params.get("password"),
        createdAt: new Date().toISOString(),
      };

      const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8") || "[]");

      if (user.email && users.some((u) => u.email === user.email)) {
        return sendErrorResponse(res, "Email already registered!");
      }

      users.push(user);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

      // ✅ Send alert + redirect
      res.writeHead(200, { "Content-Type": "text/html" });
res.end(`
  <script>
    alert("${user.firstName} ${user.lastName} registered successfully!");
    window.location.href = "/";
  </script>
`);

    } catch (err) {
      console.error(err);
      sendErrorResponse(res, "Something went wrong!");
    }
  });
}else {
    // 404 page
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Page Not Found</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px;
            background: #ffeaa7;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
          }
          h1 { color: #e74c3c; }
          .nav { margin: 20px 0; }
          .nav a {
            color: #3498db;
            text-decoration: none;
            margin-right: 15px;
          }
          .nav a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="nav">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </div>
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>
      </body>
      </html>
    `);
  }
}

