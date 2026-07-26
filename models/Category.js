const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

categorySchema.index({ shopId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);