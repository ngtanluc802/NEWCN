// backend/src/controllers/promotionController.js
const Promotion = require('../models/Promotion');

const ITEMS_PER_PAGE = 5;

/**
 * Lấy danh sách Khuyến mãi (có phân trang và tìm kiếm)
 */
const getPromotions = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 5 } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Logic Tìm kiếm: theo Tiêu đề (title) hoặc Mã code (code)
    const searchFilter = query ? {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
      ]
    } : {};

    const promotions = await Promotion.find(searchFilter)
      .skip(skip)
      .limit(limitNum)
      .sort({ startDate: -1 }); // Sắp xếp theo ngày bắt đầu
    
    const totalDocuments = await Promotion.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: promotions,
      totalPages: totalPages,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Lấy chi tiết 1 Khuyến mãi
 */
const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ data: promotion });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Tạo Khuyến mãi mới
 */
const createPromotion = async (req, res) => {
  try {
    // Kiểm tra mã code đã tồn tại chưa
    const codeExists = await Promotion.findOne({ code: req.body.code });
    if (codeExists) {
        return res.status(400).json({ message: 'Lỗi: Mã khuyến mãi này đã tồn tại' });
    }

    const promotion = new Promotion(req.body);
    await promotion.save(); // Hàm 'pre.save' trong Model sẽ tự động set 'status'
    res.status(201).json({ message: 'Promotion created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Cập nhật Khuyến mãi
 */
const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    // Sau khi cập nhật, gọi save() lần nữa để trigger hàm 'pre.save' cập nhật lại status
    if (promotion) {
      await promotion.save();
    } else {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    res.json({ message: 'Promotion updated' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Xóa Khuyến mãi
 */
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
};