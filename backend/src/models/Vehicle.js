// backend/src/models/Vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  // SỬA LỖI: Đổi tên trường thành 'plateNumber'
  plateNumber: {
    type: String,
    required: [true, 'Biển số xe là bắt buộc'],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Loại xe là bắt buộc'],
    enum: ['Giường nằm', 'Ghế ngồi', 'Limousine'],
  },
  status: {
    type: String,
    required: true,
    default: 'Sẵn sàng',
    enum: ['Sẵn sàng', 'Đang chạy', 'Bảo trì'],
  },
  driverName: {
    type: String,
    default: 'Chưa gán',
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);