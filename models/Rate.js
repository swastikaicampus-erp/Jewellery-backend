const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    metalType: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // "Gold" aur "gold" same treat honge, duplicate rates se bachega
    },
    karat: { type: String, trim: true, default: null }, // ye bhi free text ho sakta hai ab
    ratePerGram: { type: Number, required: true },
  },
  { timestamps: true }
);

rateSchema.index({ shopId: 1, metalType: 1, karat: 1 }, { unique: true });

module.exports = mongoose.model('Rate', rateSchema);