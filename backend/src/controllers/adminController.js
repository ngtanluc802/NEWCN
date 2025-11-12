// backend/src/controllers/adminController.js
const Vehicle = require("../models/Vehicle.js"); // Sửa: import -> require

const ITEMS_PER_PAGE = 5;

// ➕ Thêm xe
const createVehicle = async (req, res) => { // Sửa: bỏ 'export'
  try {
    const vehicle = await Vehicle.create(req.body);
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📋 LẤY DANH SÁCH XE (ĐÃ SỬA)
const getVehicles = async (req, res) => { // Sửa: bỏ 'export'
  try {
    const { query = '', page = 1, limit = ITEMS_PER_PAGE } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const searchFilter = query ? {
      $or: [
        { plateNumber: { $regex: query, $options: 'i' } },
        { driverName: { $regex: query, $options: 'i' } },
        { id: { $regex: query, $options: 'i' } }
      ],
    } : {};

    const totalDocuments = await Vehicle.countDocuments(searchFilter);
    const vehicles = await Vehicle.find(searchFilter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: vehicles,
      totalPages: totalPages,
    });
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách xe:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 🔍 Lấy chi tiết 1 xe
const getVehicle = async (req, res) => { // Sửa: bỏ 'export'
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
};

// ✏️ Cập nhật xe
const updateVehicle = async (req, res) => { // Sửa: bỏ 'export'
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ❌ Xóa xe
const deleteVehicle = async (req, res) => { // Sửa: bỏ 'export'
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sửa: Dùng module.exports
module.exports = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};