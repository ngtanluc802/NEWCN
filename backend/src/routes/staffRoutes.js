// backend/src/routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController'); // (Chúng ta sẽ tạo file này ở bước 3)

router.post('/', createStaff);
router.get('/', getStaff);
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;