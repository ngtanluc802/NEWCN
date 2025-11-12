// backend/src/routes/promotionRoutes.js
const express = require('express');
const router = express.Router();

const {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion
} = require('../controllers/promotionController.js');

router.get('/', getPromotions);
router.post('/', createPromotion);
router.get('/:id', getPromotionById);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

module.exports = router;