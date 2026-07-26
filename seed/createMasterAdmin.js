require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ role: 'master_admin' });
  if (exists) {
    console.log('Master admin already exists');
    process.exit();
  }

  await User.create({
    name: 'Master Admin',
    email: 'admin@jewellery.com',
    password: 'admin123', // pehli baar login karke change kar lena
    role: 'master_admin',
  });

  console.log('Master admin created: admin@jewellery.com / admin123');
  process.exit();
})();