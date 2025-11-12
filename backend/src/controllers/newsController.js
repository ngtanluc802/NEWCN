// backend/src/controllers/newsController.js
const News = require('../models/News');

const ITEMS_PER_PAGE = 5;

/**
 * Lấy danh sách Tin tức (có phân trang và tìm kiếm)
 */
const getNews = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 5 } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Logic Tìm kiếm: theo Tiêu đề (title)
    const searchFilter = query ? {
      title: { $regex: query, $options: 'i' }
    } : {};

    const newsList = await News.find(searchFilter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }); // Tin mới nhất lên đầu
    
    const totalDocuments = await News.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: newsList,
      totalPages: totalPages,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Lấy chi tiết 1 Tin tức
 */
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ data: news });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Tạo Tin tức mới
 */
const createNews = async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json({ message: 'News created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Cập nhật Tin tức
 */
const updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News updated' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Xóa Tin tức
 */
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Export đầy đủ 5 hàm
module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};