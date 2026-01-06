const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const UserSession = require('../models/UserSession');

/**
 * Sign up - Create organization and first user
 */
async function signup(req, res) {
  try {
    const { organizationName, address, contactEmail, contactPhone, registrationNumber, fullName, email, password } = req.body;

    // Check if organization already exists
    const existingOrg = await Organization.findOne({ name: organizationName });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization already exists' });
    }

    // Check if user email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create organization
    const organization = new Organization({
      name: organizationName,
      address,
      contactEmail,
      contactPhone,
      registrationNumber
    });
    await organization.save();

    // Create first user (admin)
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      organization: organization._id,
      role: 'admin',
      isFirstLogin: true
    });
    user.createdBy = user._id; // Self-reference
    await user.save();

    organization.createdBy = user._id;
    await organization.save();

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    res.status(201).json({
      message: 'Organization and user created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organization: {
          id: organization._id,
          name: organization.name
        }
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).populate('organization');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        organization: {
          id: user.organization._id,
          name: user.organization.name
        }
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Get current user
 */
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .populate('organization')
      .select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Refresh access token
 */
async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}

/**
 * Logout (mark first login as false if it's first login)
 */
async function logout(req, res) {
  try {
    // If it's first login, mark it as false
    if (req.user.isFirstLogin) {
      await User.findByIdAndUpdate(req.user._id, { isFirstLogin: false });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  signup,
  login,
  getMe,
  refreshToken,
  logout
};

