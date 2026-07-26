const Category = require('../models/Category');

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name zaroori hai' });

    const category = await Category.create({ shopId: req.user.shopId, name });
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Ye category pehle se hai' });
    }
    next(err);
  }
};

exports.getMyCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ shopId: req.user.shopId }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user.shopId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated', category });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, shopId: req.user.shopId });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};