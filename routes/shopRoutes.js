const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { checkSubscription } = require('../middleware/checkSubscription');
const { createItem, getMyItems, getItemById, updateItem, deleteItem } = require('../controllers/itemController');
const { setRate, getMyRates, deleteRate } = require('../controllers/rateController');
const { createCategory, getMyCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const {
  getMyShopProfile,
  updateMyProfile,
  addPromoSlide,
  updatePromoSlide,
  deletePromoSlide,
} = require('../controllers/shopController');
const upload = require('../middleware/upload');

router.use(protect, authorize('shop_admin'), checkSubscription);

// Items
router.post('/items', upload.single('image'), createItem);
router.get('/items', getMyItems);
router.get('/items/:id', getItemById);
router.put('/items/:id', upload.single('image'), updateItem);
router.delete('/items/:id', deleteItem);

router.get('/profile', getMyShopProfile);
router.put('/profile', upload.single('logo'), updateMyProfile);

// Promo slider (home page)
router.post('/profile/promo-slides', upload.single('image'), addPromoSlide);
router.put('/profile/promo-slides/:slideId', upload.single('image'), updatePromoSlide);
router.delete('/profile/promo-slides/:slideId', deletePromoSlide);

// Rates
router.put('/rates', setRate);
router.get('/rates', getMyRates);
router.delete('/rates/:id', deleteRate);

// Categories
router.post('/categories', createCategory);
router.get('/categories', getMyCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;