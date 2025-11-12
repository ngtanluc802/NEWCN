// backend/src/models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  id: { // Mã NV (ví dụ: NV001)
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Tài xế', 'Phụ xe', 'Nhân viên VP'],
  },
  license: { // Số GPLX
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ['Đang làm việc', 'Tạm nghỉ'],
    default: 'Đang làm việc',
  },
});

module.exports = mongoose.model('Staff', staffSchema);