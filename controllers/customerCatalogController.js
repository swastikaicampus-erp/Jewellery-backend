const Shop = require('../models/Shop');
const Item = require('../models/Item');
const { attachPrices } = require('./itemController');
const Rate = require('../models/Rate');


// GET /api/customer/shop-info
exports.getMyShopInfo = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.customer.shopId).select('shopName ownerName phone address shopCode logoUrl');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (err) {
    next(err);
  }
};

// GET /api/customer/items
exports.getMyShopItems = async (req, res, next) => {
  try {
    const items = await Item.find({ shopId: req.customer.shopId, status: 'active' })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    const withPrices = await attachPrices(req.customer.shopId, items);
    res.json(withPrices);
  } catch (err) {
    next(err);
  }
};

// GET /api/customer/items/:id
exports.getMyShopItemById = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, shopId: req.customer.shopId, status: 'active' }).populate('categoryId', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const [withPrice] = await attachPrices(req.customer.shopId, [item]);
    res.json(withPrice);
  } catch (err) {
    next(err);
  }
};

// GET /api/customer/rates
exports.getMyShopRates = async (req, res, next) => {
  try {
    const rates = await Rate.find({ shopId: req.customer.shopId }).sort({ metalType: 1, karat: 1 });
    res.json(rates);
  } catch (err) {
    next(err);
  }
};