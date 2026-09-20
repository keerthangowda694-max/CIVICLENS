const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const register = async (req, res) => {
  try {
    const { name, email, password, role = 'citizen', department, area } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      department: role === 'authority' ? (department || 'Public Works') : null,
      area: area || 'Central City Zone',
      points: 20,
      badges: [
        {
          id: 'civic-observer',
          name: 'Civic Observer',
          icon: '🏙️',
          description: 'Joined Civic Lens community to build a cleaner, safer city.',
        }
      ]
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        points: newUser.points,
        badges: newUser.badges,
        area: newUser.area,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        points: user.points,
        badges: user.badges,
        area: user.area,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Demo quick-login switcher helper
const getDemoAccounts = async (req, res) => {
  try {
    const demoCitizen = await User.findOne({ email: 'citizen@civiclens.ai' });
    const demoAdmin = await User.findOne({ email: 'admin@civiclens.ai' });

    res.json({
      citizen: demoCitizen ? { email: demoCitizen.email, name: demoCitizen.name, role: demoCitizen.role } : null,
      admin: demoAdmin ? { email: demoAdmin.email, name: demoAdmin.name, role: demoAdmin.role } : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching demo accounts' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getDemoAccounts
};
