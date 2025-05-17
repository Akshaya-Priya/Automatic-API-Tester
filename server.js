// server.js
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
const port = 3000;

// Home route
app.get('/', (req, res) => {
  res.send('🏠 Welcome to the API server!');
});

// Users list route
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]);
});

// Single user by ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.json({ id, name: `User ${id}` });
});

// Products list
app.get('/api/products', (req, res) => {
  res.json([
    { id: 101, name: 'Laptop' },
    { id: 102, name: 'Phone' },
  ]);
});

// Exporting the app instead of starting it
module.exports = app;

// If you want to run it directly (for dev testing):
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}
