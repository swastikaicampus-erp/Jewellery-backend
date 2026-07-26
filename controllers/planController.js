const Plan = require('../models/Plan');

// POST /api/master/plans
exports.createPlan = async (req, res, next) => {
  try {
    const { name, durationInDays, price, description } = req.body;
    if (!name || !durationInDays || price === undefined) {
      return res.status(400).json({ message: 'name, durationInDays, price zaroori hai' });
    }
    const plan = await Plan.create({ name, durationInDays, price, description });
    res.status(201).json({ message: 'Plan created', plan });
  } catch (err) {
    next(err);
  }
};

// GET /api/master/plans
exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find().sort({ durationInDays: 1 });
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

// PUT /api/master/plans/:id
exports.updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan updated', plan });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/master/plans/:id
exports.deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    next(err);
  }
};