require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { startSubscriptionCron } = require('./utils/subscriptionCron');
startSubscriptionCron();

const app = express();
connectDB();

const allowedOrigins = [
  'http://localhost:5173',                    // local development
  'https://nidhiplus-e63b8.web.app',           // live frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman/curl jaise tools se aane wali requests (jinme origin nahi hota) allow karo
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: is origin ki permission nahi hai'));
    }
  },
  credentials: true,

}));



// tetsmdkdmk

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/master', require('./routes/masterRoutes'));
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/uploads', express.static('uploads'));

app.use('/apk', express.static('apk')); 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));