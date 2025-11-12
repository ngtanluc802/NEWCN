// backend/src/models/Route.js
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  // Mã tuyến (ví dụ: SG-DL)
  routeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  // Tên tuyến (ví dụ: Sài Gòn - Đà Lạt)
  name: {
    type: String,
    required: [true, 'Tên tuyến là bắt buộc'],
    trim: true,
  },
  // Điểm đi
  startPoint: {
    type: String,
    required: [true, 'Điểm đi là bắt buộc'],
  },
  // Điểm đến
  endPoint: {
    type: String,
    required: [true, 'Điểm đến là bắt buộc'],
  },
  // Khoảng cách (km)
  distance: {
    type: Number,
    required: [true, 'Khoảng cách là bắt buộc'],
  },
  // Thời gian di chuyển (tiếng)
  duration: {
    type: Number,
    required: [true, 'Thời gian di chuyển là bắt buộc'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);