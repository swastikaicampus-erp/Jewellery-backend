const Customer = require('../models/Customer');

// GET /api/customer/profile
exports.getMyProfile = async (req, res, next) => {
  try {
    // protectCustomer middleware already fetches req.customer with password excluded
    res.json(req.customer);
  } catch (err) {
    next(err);
  }
};

// PUT /api/customer/profile — naam/phone edit (username change nahi hota, login id hai)
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const customer = await Customer.findByIdAndUpdate(req.customer._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// PUT /api/customer/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // req.customer me password field nahi hai (middleware ne select('-password') kiya tha),
    // isliye compare karne ke liye dobara fetch karna padega
    const customer = await Customer.findById(req.customer._id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const isMatch = await customer.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    customer.password = newPassword;
    await customer.save(); // pre-save hook naya password hash kar dega

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};