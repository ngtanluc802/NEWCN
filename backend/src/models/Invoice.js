// backend/src/models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  // Liên kết đến User (người đặt vé)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Liên kết đến Lịch trình (chuyến đi)
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  // Các ghế đã đặt (ví dụ: ["A01", "A02"])
  seats: [{
    type: String,
    required: true,
  }],
  // Tổng tiền
  totalPrice: {
    type: Number,
    required: true,
  },
  // Trạng thái thanh toán
  status: {
    type: String,
    enum: ['Chờ thanh toán', 'Đã thanh toán', 'Đã hủy'],
    default: 'Chờ thanh toán',
  },
}, { timestamps: true }); // Tự động thêm createdAt

module.exports = mongoose.model('Invoice', invoiceSchema);