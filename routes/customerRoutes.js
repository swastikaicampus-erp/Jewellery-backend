const express = require('express');
const router = express.Router();
const { protectCustomer } = require('../middleware/customerAuth');
const { register, login } = require('../controllers/customerAuthController');
const { getMyShopInfo, getMyShopItems, getMyShopItemById ,getMyShopRates } = require('../controllers/customerCatalogController');
const { getMyProfile, updateMyProfile, changePassword } = require('../controllers/customerProfileController');

router.post('/register', register);
router.post('/login', login);

router.use(protectCustomer);
router.get('/shop-info', getMyShopInfo);
router.get('/items', getMyShopItems);
router.get('/items/:id', getMyShopItemById);

router.get('/rates', getMyShopRates);

router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.put('/change-password', changePassword);

module.exports = router;