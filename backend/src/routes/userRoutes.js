// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');

// Ánh xạ với các hàm trong frontend actions.ts

// POST /api/users (Tạo user - Dùng cho trang "Thêm người dùng mới")
router.post('/', createUser);

// GET /api/users (Lấy danh sách, tìm kiếm, phân trang - Dùng cho trang "Quản lý người dùng")
router.get('/', getUsers);

// GET /api/users/:id (Lấy chi tiết - Dùng cho trang "Chi tiết" và "Chỉnh sửa")
router.get('/:id', getUserById);

// PUT /api/users/:id (Cập nhật - Dùng cho trang "Chỉnh sửa")
router.put('/:id', updateUserRole);

// DELETE /api/users/:id (Xóa - Dùng cho nút Xóa)
router.delete('/:id', deleteUser);

module.exports = router;