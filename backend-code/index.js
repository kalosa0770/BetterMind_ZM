const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParse = require('cookie-parser');
const csurf = require('csurf');
const dotenv = require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; 

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParse());

//CSRF protection middleware
const csrfProtection = csurf({ cookie: true });

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const journalRoutes = require('./routes/journal'); // journal route

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bettermind_zm')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register routes
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', journalRoutes); // journal route
app.use('/api', csrfProtection); // csrf Protection router

// An API endpoint to get new the CSRF token from the frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Access from laptop: http://localhost:${PORT}`);
  console.log(`Access from other devices:  http://192.168.20.116:${PORT}`);
});
