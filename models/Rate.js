const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    metalType: { type: String, enum: ['gold', 'silver'], required: true },
    karat: { type: String, enum: ['24K', '22K', '21K', '18K', '14K', null], default: null }, // silver ke liye null
    ratePerGram: { type: Number, required: true },
  },
  { timestamps: true }
);

// Ek shop ka ek hi metal+karat combination ka ek hi rate ho sakta hai
rateSchema.index({ shopId: 1, metalType: 1, karat: 1 }, { unique: true });

module.exports = mongoose.model('Rate', rateSchema);