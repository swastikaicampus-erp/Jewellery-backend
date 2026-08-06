const Rate = require('../models/Rate');

// PUT /api/shop/rates  — set ya update (upsert)
exports.setRate = async (req, res, next) => {
  try {
    const { metalType, karat, ratePerGram } = req.body;

    if (!metalType || ratePerGram === undefined) {
      return res.status(400).json({ message: 'metalType aur ratePerGram zaroori hai' });
    }

    const normalizedMetal = metalType.trim().toLowerCase();
    const isGold = normalizedMetal === 'gold';

    if (isGold && !karat) {
      return res.status(400).json({ message: 'Gold ke liye karat likho' });
    }

    const rate = await Rate.findOneAndUpdate(
      { shopId: req.user.shopId, metalType: normalizedMetal, karat: isGold ? karat.trim() : null },
      { ratePerGram },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Rate updated', rate });
  } catch (err) {
    next(err);
  }
};

// GET /api/shop/rates
exports.getMyRates = async (req, res, next) => {
  try {
    const rates = await Rate.find({ shopId: req.user.shopId }).sort({ metalType: 1, karat: 1 });
    res.json(rates);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/shop/rates/:id
exports.deleteRate = async (req, res, next) => {
  try {
    const rate = await Rate.findOneAndDelete({ _id: req.params.id, shopId: req.user.shopId });
    if (!rate) return res.status(404).json({ message: 'Rate not found' });
    res.json({ message: 'Rate deleted' });
  } catch (err) {
    next(err);
  }
};