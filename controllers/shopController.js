const Shop = require('../models/Shop');
const Plan = require('../models/Plan');
const User = require('../models/User');

const generateShopCode = async () => {
  let code, exists = true;
  while (exists) {
    code = 'SHOP' + Math.floor(1000 + Math.random() * 9000);
    exists = await Shop.findOne({ shopCode: code });
  }
  return code;
};

const getExpiryFromPlan = (durationInDays) => {
  const now = new Date();
  now.setDate(now.getDate() + durationInDays);
  return now;
};

// POST /api/master/shops  (multipart/form-data — qrImage file ke saath)
exports.createShop = async (req, res, next) => {
  try {
    const { shopName, ownerName, phone, email, address, planId, transactionId, adminPassword } = req.body;

    if (!shopName || !ownerName || !phone || !adminPassword || !planId) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(400).json({ message: 'Invalid plan selected' });

    const shopCode = await generateShopCode();

    const shop = await Shop.create({
      shopName, ownerName, phone, email, address,
      shopCode,
      planId,
      subscriptionExpiry: getExpiryFromPlan(plan.durationInDays),
      paymentProof: {
        transactionId: transactionId || '',
        qrImageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      },
    });

    const shopAdmin = await User.create({
      name: ownerName,
      email: email || `${shopCode.toLowerCase()}@jewellery.local`,
      phone,
      password: adminPassword,
      role: 'shop_admin',
      shopId: shop._id,
    });

    res.status(201).json({
      message: 'Shop created successfully',
      shop,
      shopAdminLogin: { email: shopAdmin.email, password: adminPassword },
      publicLink: `/shop/${shop.shopCode}`,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllShops = async (req, res, next) => {
  try {
    const shops = await Shop.find().populate('planId', 'name durationInDays price').sort({ createdAt: -1 });
    res.json(shops);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/master/shops/:id/plan  (multipart — renewal payment proof ke saath)
exports.updateSubscriptionPlan = async (req, res, next) => {
  try {
    const { planId, transactionId } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(400).json({ message: 'Invalid plan' });

    const updateData = {
      planId,
      subscriptionExpiry: getExpiryFromPlan(plan.durationInDays),
    };

    if (transactionId) updateData['paymentProof.transactionId'] = transactionId;
    if (req.file) updateData['paymentProof.qrImageUrl'] = `/uploads/${req.file.filename}`;

    const shop = await Shop.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('planId', 'name durationInDays price');

    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json({ message: 'Plan renewed successfully', shop });
  } catch (err) {
    next(err);
  }
};

exports.updateShopStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const shop = await Shop.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    await User.updateMany({ shopId: shop._id }, { status });
    res.json({ message: `Shop ${status}`, shop });
  } catch (err) {
    next(err);
  }
};

// PUT /api/master/shops/:id  (basic details edit)
exports.updateShopDetails = async (req, res, next) => {
  try {
    const { shopName, ownerName, phone, email, address } = req.body;
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { shopName, ownerName, phone, email, address },
      { new: true, runValidators: true }
    ).populate('planId', 'name durationInDays price');

    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json({ message: 'Shop updated', shop });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/master/shops/:id
exports.deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    await User.deleteMany({ shopId: shop._id }); // cascade — shop admin bhi hat jaye
    res.json({ message: 'Shop deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/shop/profile  (shop_admin only — apni shop ki details)
exports.getMyShopProfile = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.user.shopId).populate('planId', 'name durationInDays price');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (err) {
    next(err);
  }
};