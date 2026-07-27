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

const uploadFields = upload.fields([
  { name: 'qrImage', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
]);

router.use(protect, authorize('master_admin'));



router.post('/shops', uploadFields, createShop);
router.get('/shops', getAllShops);
router.put('/shops/:id', uploadFields, updateShopDetails); // agar logo edit me bhi change karni ho
router.patch('/shops/:id/plan', upload.single('qrImage'), updateSubscriptionPlan);
router.patch('/shops/:id/status', updateShopStatus);
router.delete('/shops/:id', deleteShop);


// Plans
router.post('/plans', createPlan);
router.get('/plans', getAllPlans);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

module.exports = router;