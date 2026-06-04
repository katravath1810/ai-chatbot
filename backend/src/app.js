const express = require('express');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use chat routes
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;