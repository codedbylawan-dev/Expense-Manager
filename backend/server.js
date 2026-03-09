// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

// Create Express application
const app = express();

// Server port (Render provides PORT automatically in production)
const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
| Allows requests from the frontend application.
| In production, FRONTEND_URL should be set in environment variables.
*/
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};

// Apply middlewares
app.use(cors(corsOptions));      // Enable CORS
app.use(express.json());         // Parse JSON request bodies

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
| Simple route to confirm the API server is running.
| Useful for deployment checks (Render, monitoring tools, etc.)
*/
app.get('/', (req, res) => {
  res.send('Expense Manager API is running');
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All authentication and transaction routes are defined separately
| inside the routes folder for better project structure.
*/
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
| If a request does not match any defined route,
| this middleware returns a "Route not found" response.
*/
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
| Catches unexpected errors in the application and returns
| a generic error response while logging details to the server.
*/
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
| Launch the Express server on the specified port.
*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});