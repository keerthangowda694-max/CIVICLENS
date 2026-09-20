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

// Database Connection & Auto Seed Check
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✓ Connected to MongoDB at:', MONGODB_URI);
    
    // Quick auto-seed check if database has no complaints
    const Complaint = require('./models/Complaint');
    const count = await Complaint.countDocuments();
    if (count === 0) {
      console.log('No complaints found in DB. Auto-seeding realistic hackathon dataset...');
      const seedDatabase = require('./seed');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 CIVIC LENS AI SERVER RUNNING ON PORT ${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
      console.log(`💡 AI Pipeline: REPORT → UNDERSTAND → CONNECT → PRIORITIZE → ACT → RESOLVE`);
      console.log(`=======================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    // Even if local mongo fails to connect, allow server to listen for health check
    app.listen(PORT, () => {
      console.log(`Civic Lens server started without MongoDB on port ${PORT}`);
    });
  });

module.exports = app;
