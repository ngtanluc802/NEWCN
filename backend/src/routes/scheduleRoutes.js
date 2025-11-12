// backend/src/routes/scheduleRoutes.js
const express = require('express');
const router = express.Router();

const {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getFormData // <-- Import hàm helper
} = require('../controllers/scheduleController.js');

// GET /api/schedules/formdata (API đặc biệt để lấy data cho form)
router.get('/formdata', getFormData);

// GET /api/schedules (lấy danh sách)
router.get('/', getSchedules);

// POST /api/schedules (tạo mới)
router.post('/', createSchedule);

// Các route cho :id
router.get('/:id', getScheduleById);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;