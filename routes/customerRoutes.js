const express = require('express');
const router = express.Router();
const { protectCustomer } = require('../middleware/customerAuth');
const { register, login } = require('../controllers/customerAuthController');
const { getMyShopInfo, getMyShopItems, getMyShopItemById ,getMyShopRates } = require('../controllers/customerCatalogController');

router.post('/register', register);
router.post('/login', login);

router.use(protectCustomer);
router.get('/shop-info', getMyShopInfo);
router.get('/items', getMyShopItems);
router.get('/items/:id', getMyShopItemById);

router.get('/rates', getMyShopRates);

module.exports = router;