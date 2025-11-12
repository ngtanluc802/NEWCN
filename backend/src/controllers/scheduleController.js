// backend/src/controllers/scheduleController.js
const Schedule = require('../models/Schedule');
const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');

const ITEMS_PER_PAGE = 5;

/**
 * Lấy danh sách Lịch trình (Task 9)
 */
const getSchedules = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const searchFilter = {};
    if (query) {
      const searchRegex = { $regex: query, $options: 'i' };
      const matchingRoutes = await Route.find({ 
        $or: [{ name: searchRegex }, { startPoint: searchRegex }, { endPoint: searchRegex }] 
      }).select('_id');
      const matchingVehicles = await Vehicle.find({ 
        $or: [{ plateNumber: searchRegex }, { driverName: searchRegex }] 
      }).select('_id');

      searchFilter.$or = [
        { route: { $in: matchingRoutes.map(r => r._id) } },
        { vehicle: { $in: matchingVehicles.map(v => v._id) } },
      ];
    }

    const schedules = await Schedule.find(searchFilter)
      .populate('route')
      .populate('vehicle')
      .skip(skip)
      .limit(limitNum)
      .sort({ departureTime: 1 });
    
    const totalDocuments = await Schedule.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: schedules,
      totalPages: totalPages,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * TASK 10: Lấy chi tiết 1 Lịch trình (Cho trang "Xem" và "Sửa")
 */
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('route')
      .populate('vehicle');
      
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * TASK 10: Tạo Lịch trình mới (Cần Validation)
 */
const createSchedule = async (req, res) => {
  try {
    const { route, vehicle, departureTime, price } = req.body;

    // TODO: Thêm logic kiểm tra xem xe (vehicle) có bị trùng lịch vào
    // ngày/giờ (departureTime) đó hay không. (Đây là Validation nâng cao)

    const schedule = new Schedule({
      route,
      vehicle,
      departureTime,
      price,
      status: 'Sắp mở bán', // Mặc định khi tạo mới
    });
    await schedule.save();
    res.status(201).json({ message: 'Schedule created successfully' });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * TASK 10: Cập nhật Lịch trình
 */
const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule updated' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * TASK 10: Xóa Lịch trình
 */
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * TASK 10 (Helper): Lấy dữ liệu cho Form (Tất cả Tuyến và Xe)
 */
const getFormData = async (req, res) => {
  try {
    // Lấy tất cả, không phân trang, chỉ lấy trường 'name' và '_id'
    const routes = await Route.find().select('name _id');
    // Chỉ lấy xe 'Sẵn sàng' và các trường cần thiết
    const vehicles = await Vehicle.find({ status: 'Sẵn sàng' }).select('plateNumber driverName _id');

    res.json({
      routes,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// SỬA LẠI: Export tất cả các hàm
module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getFormData, // <-- Thêm hàm helper
};