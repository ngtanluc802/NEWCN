// backend/src/controllers/vehicleController.js
const Vehicle = require('../models/Vehicle');

/**
 * Lấy danh sách Vehicles
 */
const getVehicles = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 5 } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // SỬA LẠI: Thêm 'id' vào logic tìm kiếm
    const searchFilter = query ? {
      $or: [
        { id: { $regex: query, $options: 'i' } }, // <-- THÊM DÒNG NÀY
        { plateNumber: { $regex: query, $options: 'i' } },
        { driverName: { $regex: query, $options: 'i' } },
      ],
    } : {};

    const vehicles = await Vehicle.find(searchFilter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const totalDocuments = await Vehicle.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: vehicles,
      totalPages: totalPages,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Lấy chi tiết 1 Vehicle
 */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ data: vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Tạo Vehicle mới
 */
const createVehicle = async (req, res) => {
  const { id, plateNumber } = req.body;

  try {
    const vehicleExists = await Vehicle.findOne({ $or: [{ id }, { plateNumber }] });
    if (vehicleExists) {
      return res.status(400).json({ message: 'Lỗi: Mã xe hoặc Biển số xe đã tồn tại' });
    }

    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json({ message: 'Vehicle created successfully' });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Cập nhật Vehicle
 */
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle updated' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Xóa Vehicle
 */
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};