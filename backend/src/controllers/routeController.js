// backend/src/controllers/routeController.js
const Route = require('../models/Route');

const ITEMS_PER_PAGE = 5;

/**
 * Lấy danh sách Tuyến xe
 */
const getRoutes = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 5 } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const searchFilter = query ? {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { startPoint: { $regex: query, $options: 'i' } },
        { endPoint: { $regex: query, $options: 'i' } },
      ],
    } : {};

    const routes = await Route.find(searchFilter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const totalDocuments = await Route.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: routes,
      totalPages: totalPages,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Tạo Route mới
 */
const createRoute = async (req, res) => {
  try {
    const routeExists = await Route.findOne({ routeId: req.body.routeId });
    if (routeExists) {
      return res.status(400).json({ message: 'Lỗi: Mã tuyến xe này đã tồn tại' });
    }

    const route = new Route(req.body);
    await route.save();
    res.status(201).json({ message: 'Route created successfully' });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Lấy chi tiết 1 Route
 */
const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json({ data: route });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Cập nhật Route
 */
const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json({ message: 'Route updated' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Xóa Route
 */
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json({ message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// SỬA LỖI: Export đầy đủ 5 hàm
module.exports = {
  getRoutes,
  createRoute,
  getRouteById,
  updateRoute,
  deleteRoute,
};