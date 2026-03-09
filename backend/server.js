// Load environment variables
require('dotenv').config();

// Import packages
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
| Allow both local development and deployed frontend.
*/
const allowedOrigins = [
  "http://localhost:3000",
  "https://expense-manager-one-murex.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Parse JSON requests
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
app.get('/', (req, res) => {
  res.send('Expense Manager API is running');
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: 'Something went wrong.' });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});