const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // "1 Month", "3 Months", "1 Year"
    durationInDays: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);