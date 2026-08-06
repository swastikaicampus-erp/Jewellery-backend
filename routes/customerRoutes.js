const express = require('express');
const router = express.Router();
const { protectCustomer } = require('../middleware/customerAuth');
const { register, login } = require('../controllers/customerAuthController');
const { getMyShopInfo, getMyShopItems, getMyShopItemById ,getMyShopRates } = require('../controllers/customerCatalogController');
const { getMyProfile, updateMyProfile, changePassword } = require('../controllers/customerProfileController');
const {
  getMyWishlist, getMyWishlistIds, addToWishlist, removeFromWishlist,
} = require('../controllers/wishlistController');



router.post('/register', register);
router.post('/login', login);

router.use(protectCustomer);
router.get('/shop-info', getMyShopInfo);
router.get('/items', getMyShopItems);
router.get('/items/:id', getMyShopItemById);


router.get('/wishlist', getMyWishlist);
router.get('/wishlist/ids', getMyWishlistIds);
router.post('/wishlist/:itemId', addToWishlist);
router.delete('/wishlist/:itemId', removeFromWishlist);

router.get('/rates', getMyShopRates);

router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.put('/change-password', changePassword);

module.exports = router;