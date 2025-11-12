// backend/src/models/Promotion.js
const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  // Tên chương trình (ví dụ: Chào hè 2026)
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true,
  },
  // Mã khuyến mãi (ví dụ: HE2026)
  code: {
    type: String,
    required: [true, 'Mã code là bắt buộc'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  // Phần trăm giảm (ví dụ: 20)
  discountPercent: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  // Ngày bắt đầu
  startDate: {
    type: Date,
    required: true,
  },
  // Ngày hết hạn
  endDate: {
    type: Date,
    required: true,
  },
  // Trạng thái (Tự động tính toán)
  status: {
    type: String,
    enum: ['Sắp diễn ra', 'Đang diễn ra', 'Đã kết thúc'],
    default: 'Sắp diễn ra',
  },
}, { timestamps: true });

// Tự động cập nhật trạng thái trước khi lưu
promotionSchema.pre('save', function(next) {
  const now = new Date();
  if (now < this.startDate) {
    this.status = 'Sắp diễn ra';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'Đang diễn ra';
  } else {
    this.status = 'Đã kết thúc';
  }
  next();
});

module.exports = mongoose.model('Promotion', promotionSchema);