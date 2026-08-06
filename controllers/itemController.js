const Item = require('../models/Item');
const Rate = require('../models/Rate');

const attachPrices = async (shopId, items) => {
  const rates = await Rate.find({ shopId });
  const rateMap = {};
  rates.forEach((r) => {
    const key = r.karat ? `${r.metalType}-${r.karat}` : r.metalType;
    rateMap[key] = r.ratePerGram;
  });

  return items.map((item) => {
    const plainItem = item.toObject ? item.toObject() : item;
    const key = plainItem.karat ? `${plainItem.metalType}-${plainItem.karat}` : plainItem.metalType;
    const ratePerGram = rateMap[key] || 0;
    const price = Math.round(ratePerGram * plainItem.weight + plainItem.makingCharge);
    return { ...plainItem, ratePerGram, price };
  });
};

exports.createItem = async (req, res, next) => {
  try {
    const { categoryId, name, metalType, karat, weight, makingCharge, description, status } = req.body;

    if (!categoryId || !name || !metalType || !weight) {
      return res.status(400).json({ message: 'categoryId, name, metalType, weight zaroori hai' });
    }

    const isGold = metalType.trim().toLowerCase() === 'gold';
    if (isGold && !karat) {
      return res.status(400).json({ message: 'Gold item ke liye karat likho' });
    }

    const item = await Item.create({
      shopId: req.user.shopId,
      categoryId,
      name,
      metalType,
      karat: isGold ? karat : null,
      weight,
      makingCharge: makingCharge || 0,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      description,
      status: status || 'active',
    });

    const [withPrice] = await attachPrices(req.user.shopId, [item]);
    res.status(201).json({ message: 'Item added', item: withPrice });
  } catch (err) {
    next(err);
  }
};

exports.getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ shopId: req.user.shopId })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    const withPrices = await attachPrices(req.user.shopId, items);
    res.json(withPrices);
  } catch (err) {
    next(err);
  }
};

exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, shopId: req.user.shopId }).populate('categoryId', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const [withPrice] = await attachPrices(req.user.shopId, [item]);
    res.json(withPrice);
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user.shopId },
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');

    if (!item) return res.status(404).json({ message: 'Item not found' });

    const [withPrice] = await attachPrices(req.user.shopId, [item]);
    res.json({ message: 'Item updated', item: withPrice });
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, shopId: req.user.shopId });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports.attachPrices = attachPrices;