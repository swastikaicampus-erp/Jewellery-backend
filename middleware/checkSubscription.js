const Shop = require('../models/Shop');

// shop_admin routes ke liye — protect() ke baad chalega
exports.checkSubscription = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.user.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    if (shop.status === 'suspended') {
      return res.status(403).json({ message: 'Your shop is suspended, contact support' });
    }

    if (shop.subscriptionExpiry < new Date()) {
      // Auto-suspend karo taaki dobara-dobara ye check na dohrana pade
      shop.status = 'suspended';
      await shop.save();
      return res.status(403).json({
        message: 'Subscription expired, please renew your plan',
      });
    }

    req.shop = shop; // aage controllers me reuse ho sakta hai (extra query bachegi)
    next();
  } catch (err) {
    next(err);
  }
};