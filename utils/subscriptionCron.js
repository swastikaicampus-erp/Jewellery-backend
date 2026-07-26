const cron = require('node-cron');
const Shop = require('../models/Shop');

// Har din raat 12:01 baje check karega
exports.startSubscriptionCron = () => {
  cron.schedule('1 0 * * *', async () => {
    const result = await Shop.updateMany(
      { subscriptionExpiry: { $lt: new Date() }, status: 'active' },
      { status: 'suspended' }
    );
    console.log(`Subscription cron: ${result.modifiedCount} shop(s) suspended`);
  });
};