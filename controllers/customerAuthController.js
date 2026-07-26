const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Shop = require('../models/Shop');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/customer/register
exports.register = async (req, res, next) => {
  try {
    const { name, username, password, phone, shopCode } = req.body;

    if (!name || !username || !password || !shopCode) {
      return res.status(400).json({ message: 'name, username, password, shopCode zaroori hai' });
    }

    const shop = await Shop.findOne({ shopCode: shopCode.toUpperCase().trim() });
    if (!shop) {
      return res.status(400).json({ message: 'Invalid shop code' });
    }
    if (shop.status === 'suspended' || shop.subscriptionExpiry < new Date()) {
      return res.status(400).json({ message: 'Ye shop abhi active nahi hai' });
    }

    const existing = await Customer.findOne({ username: username.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'Ye username pehle se liya hua hai' });
    }

    const customer = await Customer.create({
      name,
      username: username.toLowerCase().trim(),
      password,
      phone,
      shopId: shop._id,
    });

    const token = generateToken(customer._id);

    res.status(201).json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        username: customer.username,
        shopId: customer.shopId,
        shopName: shop.shopName,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/customer/login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username aur password zaroori hai' });
    }

    const customer = await Customer.findOne({ username: username.toLowerCase().trim() }).populate('shopId', 'shopName status subscriptionExpiry');
    if (!customer) return res.status(401).json({ message: 'Invalid credentials' });

    if (customer.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended' });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const shop = customer.shopId;
    if (!shop || shop.status === 'suspended' || shop.subscriptionExpiry < new Date()) {
      return res.status(403).json({ message: 'Ye shop abhi active nahi hai' });
    }

    const token = generateToken(customer._id);

    res.json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        username: customer.username,
        shopId: shop._id,
        shopName: shop.shopName,
      },
    });
  } catch (err) {
    next(err);
  }
};