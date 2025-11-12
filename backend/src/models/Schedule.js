// backend/src/models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  // Liên kết đến Model 'Route' (Tuyến xe)
  route: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Route', // Tên model mà nó liên kết đến
  },
  // Liên kết đến Model 'Vehicle' (Xe)
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle', // Tên model mà nó liên kết đến
  },
  // Ngày khởi hành
  departureTime: {
    type: Date,
    required: true,
  },
  // Giá vé
  price: {
    type: Number,
    required: true,
  },
  // Số ghế đã đặt (mặc định là 0)
  bookedSeats: {
    type: Number,
    default: 0,
  },
  // Trạng thái (Sắp mở bán, Đang bán, Hết vé, Đã khởi hành)
  status: {
    type: String,
    enum: ['Sắp mở bán', 'Đang bán', 'Hết vé', 'Đã khởi hành'],
    default: 'Sắp mở bán',
  },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);