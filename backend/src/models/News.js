// backend/src/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  // Tiêu đề
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true,
  },
  // Nội dung (sẽ dùng textarea ở frontend)
  content: {
    type: String,
    required: [true, 'Nội dung là bắt buộc'],
  },
  // Tác giả
  author: {
    type: String,
    default: 'Admin FUTA',
  },
  // Trạng thái (Nháp hoặc Đã đăng)
  status: {
    type: String,
    enum: ['Nháp', 'Đã đăng'],
    default: 'Nháp',
  },
  // (Bạn có thể thêm trường 'slug' hoặc 'imageUrl' sau này)

}, { timestamps: true }); // Tự động thêm createdAt

module.exports = mongoose.model('News', newsSchema);