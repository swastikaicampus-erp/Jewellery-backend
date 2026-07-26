require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { startSubscriptionCron } = require('./utils/subscriptionCron');
startSubscriptionCron();

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/master', require('./routes/masterRoutes'));
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));