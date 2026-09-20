require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const clusterRoutes = require('./routes/clusterRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const copilotRoutes = require('./routes/copilotRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civiclens';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Civic Lens AI',
    tagline: 'See the Problem. Understand the Impact. Drive the Resolution.',
    timestamp: new Date(),
    mongoConnected: mongoose.connection.readyState === 1,
    aiMode: process.env.GEMINI_API_KEY ? 'Gemini AI Enhanced' : 'Fallback Intelligence Engine'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Database Connection with Auto Fallback
const LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/civiclens';

async function startServer() {
  try {
    const targetUri = MONGODB_URI;
    console.log('Attempting MongoDB connection to:', targetUri.includes('@') ? targetUri.split('@')[1] : targetUri);
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✓ Connected to MongoDB successfully!');
  } catch (err) {
    console.warn('⚠️ Atlas connection warning (check IP whitelist):', err.message);
    if (MONGODB_URI !== LOCAL_MONGODB_URI) {
      console.log('Connecting to local MongoDB fallback at:', LOCAL_MONGODB_URI);
      try {
        await mongoose.connect(LOCAL_MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
        console.log('✓ Connected to local MongoDB fallback!');
      } catch (localErr) {
        console.warn('Local MongoDB fallback warning:', localErr.message);
      }
    }
  }

  // Quick auto-seed check if database has no complaints
  try {
    const Complaint = require('./models/Complaint');
    const count = await Complaint.countDocuments();
    if (count === 0) {
      console.log('No complaints found in DB. Auto-seeding realistic hackathon dataset...');
      const seedDatabase = require('./seed');
      await seedDatabase();
    }
  } catch (e) {
    console.warn('Auto-seed check note:', e.message);
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CIVIC LENS AI SERVER RUNNING ON PORT ${PORT}`);
    console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
    console.log(`💡 AI Mode: ${process.env.GEMINI_API_KEY ? 'Gemini AI Enhanced' : 'Fallback Intelligence Engine'}`);
    console.log(`💡 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting'}`);
    console.log(`=======================================================`);
  });
}

startServer();

module.exports = app;
