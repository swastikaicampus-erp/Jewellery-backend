const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  },
  { timestamps: true }
);

wishlistSchema.index({ customerId: 1, itemId: 1 }, { unique: true }); // ek item ek customer ke wishlist me sirf ek baar

module.exports = mongoose.model('Wishlist', wishlistSchema);