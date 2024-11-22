const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const SECRET_KEY = 'supersecretkey'; // Replace with an environment variable for production

// Middleware to parse JSON
app.use(express.json());

// Helper function to read users from the JSON file
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write users to the JSON file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};


const cors = require('cors');
app.use(cors());
// POST /signup
app.post('/signup', (req, res) => {
  const { firstName, lastName, email, age, password } = req.body;

  if (!firstName || !lastName || !email || !age || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const users = readUsers();

  // Check if email already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  const newUser = { 
    id: Date.now(), 
    firstName, 
    lastName, 
    email, 
    age, 
    password 
  };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully.', user: newUser });
});

// POST /login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = readUsers();

  // البحث عن المستخدم بالبريد الإلكتروني فقط
  const user = users.find((u) => u.email === email);

  if (!user) {
    // البريد الإلكتروني غير صحيح
    return res.status(401).json({ message: 'Incorrect email.' });
  }

  if (user.password !== password) {
    // كلمة المرور غير صحيحة
    return res.status(401).json({ message: 'Incorrect password.' });
  }

  const token = generateToken(user);

  res.status(200).json({ 
    message: 'Login successful.', 
    token, 
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});