// server.js
const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

// Mock data
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

let products = [
  { id: 101, name: 'Laptop', price: 1299.99 },
  { id: 102, name: 'Smartphone', price: 899.99 },
  { id: 103, name: 'Headphones', price: 199.99 },
];

let orders = [
  { id: 1001, user_id: 2, total: 1299.99, status: 'shipped' },
  { id: 1002, user_id: 1, total: 899.99, status: 'processing' },
  { id: 1003, user_id: 3, total: 199.99, status: 'delivered' },
];

// Helper function to parse pagination query params
function paginate(array, page = 1, limit = 10) {
  page = parseInt(page);
  limit = parseInt(limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  return array.slice(start, end);
}

// Users routes
app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) res.json(user);
  else res.status(404).json({ error: 'User not found' });
});

app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...req.body };
    res.json(users[idx]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx !== -1) {
    users.splice(idx, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Products routes
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) res.json(product);
  else res.status(404).json({ error: 'Product not found' });
});

app.post('/products', (req, res) => {
  const newProduct = {
    id: products.length + 101,
    ...req.body,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...req.body };
    res.json(products[idx]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx !== -1) {
    products.splice(idx, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Orders routes
app.get('/orders', (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const paginatedOrders = paginate(orders, page, limit);
  res.set({
    'pagination-count': orders.length,
    'pagination-page': page,
    'pagination-limit': limit
  });
  res.json(paginatedOrders);
});

app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (order) res.json(order);
  else res.status(404).json({ error: 'Order not found' });
});

// Start server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Mock API server listening at http://localhost:${port}`);
    });
}


module.exports = app;