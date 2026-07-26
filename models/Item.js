const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    metalType: { type: String, enum: ['gold', 'silver'], required: true },
    karat: { type: String, enum: ['24K', '22K', '21K', '18K', '14K', null], default: null }, // silver ke liye null
    weight: { type: Number, required: true }, // grams
    makingCharge: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
    description: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);