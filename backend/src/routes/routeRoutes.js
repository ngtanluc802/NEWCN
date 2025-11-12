// backend/src/routes/routeRoutes.js
const express = require('express');
const router = express.Router();

// Import đầy đủ 5 hàm
const {
  getRoutes,
  createRoute,
  getRouteById,
  updateRoute,
  deleteRoute
} = require('../controllers/routeController.js');

// GET /api/routes (lấy danh sách)
router.get('/', getRoutes);

// POST /api/routes (tạo mới)
router.post('/', createRoute);

// SỬA LỖI: Kích hoạt 3 đường dẫn này
router.get('/:id', getRouteById);
router.put('/:id', updateRoute);
router.delete('/:id', deleteRoute);

module.exports = router;