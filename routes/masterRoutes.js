const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createShop, getAllShops, updateSubscriptionPlan, updateShopStatus,
  updateShopDetails, deleteShop,
} = require('../controllers/shopController');
const {
  createPlan, getAllPlans, updatePlan, deletePlan,
} = require('../controllers/planController');

router.use(protect, authorize('master_admin'));



router.post('/shops', upload.single('qrImage'), createShop);
router.get('/shops', getAllShops);
router.put('/shops/:id', updateShopDetails);
router.patch('/shops/:id/plan', upload.single('qrImage'), updateSubscriptionPlan);
router.patch('/shops/:id/status', updateShopStatus);
router.delete('/shops/:id', deleteShop);


// Plans
router.post('/plans', createPlan);
router.get('/plans', getAllPlans);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

module.exports = router;