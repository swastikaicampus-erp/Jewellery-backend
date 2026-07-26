const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended, contact admin' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shopId,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/change-password (protected — koi bhi logged-in user)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current aur new password dono chahiye' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password kam se kam 6 characters ka ho' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password galat hai' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password successfully update ho gaya' });
  } catch (err) {
    next(err);
  }
};