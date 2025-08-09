// server.js - Completed Product API Assignment

const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(bodyParser.json());

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication Middleware
const API_KEY = 'my-secret-key';
const authenticate = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const key = req.headers['x-api-key'];
    if (!key || key !== API_KEY) {
      return res.status(401).json({ message: 'Unauthorized - invalid API key' });
    }
  }
  next();
};
app.use(authenticate);

// Error Handling Middleware (at the bottom)

// In-memory DB 
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

//  Routes 

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - All products (with filter + pagination)
app.get('/api/products', (req, res) => {
  let { category, page = 1, limit = 10 } = req.query;
  let results = [...products];

  // Filter by category
  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Pagination
  page = parseInt(page);
  limit = parseInt(limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    total: results.length,
    page,
    limit,
    products: paginatedResults
  });
});

// GET /api/products/:id - Get a product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price == null || !category || inStock == null) {
    return res.status(400).json({ message: 'All product fields are required' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, inStock } = req.body;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[productIndex] = {
    ...products[productIndex],
    name: name ?? products[productIndex].name,
    description: description ?? products[productIndex].description,
    price: price ?? products[productIndex].price,
    category: category ?? products[productIndex].category,
    inStock: inStock ?? products[productIndex].inStock
  };

  res.json(products[productIndex]);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully', product: deletedProduct[0] });
});

// GET /api/search - Search products by name
app.get('/api/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: 'Search query "name" is required' });
  }

  const results = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json({ total: results.length, results });
});

// GET /api/statistics - Count products by category
app.get('/api/statistics', (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  res.json({ totalProducts: products.length, countByCategory: stats });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start Server 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
