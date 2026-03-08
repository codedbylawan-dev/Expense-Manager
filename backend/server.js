require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const transRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow all in development, restrict in production if needed
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the React app build folder in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');

  app.use(express.static(buildPath));

  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) return next();

    const indexPath = path.join(buildPath, 'index.html');

    // Check if build folder exists
    if (!require('fs').existsSync(indexPath)) {
      console.error(`❌ Deployment Error: Frontend build folder is missing at ${buildPath}.`);
      console.error(`💡 Ensure your Render "Build Command" is set to "npm run build" in the root directory.`);
      return res.status(500).send('Frontend build folder is missing. Check server logs.');
    }

    res.sendFile(indexPath);
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
