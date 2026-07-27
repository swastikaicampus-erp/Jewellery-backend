const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    shopCode: { type: String, required: true, unique: true, trim: true },

    logoUrl: { type: String, default: '' },

    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    subscriptionExpiry: { type: Date, required: true },

    paymentProof: {
      transactionId: { type: String, trim: true },
      qrImageUrl: { type: String, default: '' },
    },

    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shop', shopSchema);