const Wishlist = require('../models/Wishlist');
const Item = require('../models/Item');
const { attachPrices } = require('./itemController');

// GET /api/customer/wishlist — poori list, item details ke saath
exports.getMyWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ customerId: req.customer._id }).populate({
      path: 'itemId',
      populate: { path: 'categoryId', select: 'name' },
    });

    const items = wishlist
      .filter((w) => w.itemId) // agar item delete ho gaya ho to skip
      .map((w) => w.itemId);

    const withPrices = await attachPrices(req.customer.shopId, items);
    res.json(withPrices);
  } catch (err) {
    next(err);
  }
};

// GET /api/customer/wishlist/ids — sirf item IDs ki list (fast check ke liye, card pe heart fill karne hetu)
exports.getMyWishlistIds = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ customerId: req.customer._id }).select('itemId');
    res.json(wishlist.map((w) => w.itemId.toString()));
  } catch (err) {
    next(err);
  }
};

// POST /api/customer/wishlist/:itemId — add
exports.addToWishlist = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.itemId, shopId: req.customer.shopId });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await Wishlist.findOneAndUpdate(
      { customerId: req.customer._id, itemId: req.params.itemId },
      {},
      { upsert: true }
    );

    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/customer/wishlist/:itemId — remove
exports.removeFromWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndDelete({ customerId: req.customer._id, itemId: req.params.itemId });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    next(err);
  }
};