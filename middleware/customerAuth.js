const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

exports.protectCustomer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer = await Customer.findById(decoded.id).select('-password');
    if (!customer) return res.status(401).json({ message: 'Customer not found' });
    if (customer.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended' });
    }

    req.customer = customer;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};