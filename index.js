// Import necessary modules
const express = require('express');
const app = express();

// Mock user data and permissions for demonstration
const users = {
  admin: {
    username: 'admin',
    role: 'admin',
    permissions: ['read', 'write', 'delete']
  },
  guest: {
    username: 'guest',
    role: 'guest',
    permissions: ['read']
  }
};

// Middleware to simulate user authentication
app.use((req, res, next) => {
  // Simulate retrieving user from a request, e.g., via headers
  const user = req.headers['user'];
  if (user && users[user]) {
    req.user = users[user];
  }
  next();
});

// Middleware to check for specific permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user && req.user.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).send('Permission Denied');
    }
  };
};

// Define the port for the application
const PORT = 3000;

// Routes to demonstrate permission checks
app.get('/', (req, res) => {
  res.send('Welcome! Please navigate to /profile to check permissions.');
});

app.get('/profile', requirePermission('read'), (req, res) => {
  res.send(`Your role is ${req.user.role}, and you have the following permissions: ${req.user.permissions.join(', ')}`);
});

app.post('/update', requirePermission('write'), (req, res) => {
  res.send('Profile updated successfully.');
});

app.delete('/delete', requirePermission('delete'), (req, res) => {
  res.send('Profile deleted successfully.');
});

// Handle unauthorized access attempts
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});