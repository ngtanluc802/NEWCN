// backend/src/controllers/staffController.js
const Staff = require('../models/Staff'); // (Chúng ta sẽ tạo file này ở bước 4)

/**
 * Lấy danh sách Nhân viên (Tìm kiếm & Phân trang)
 */
const getStaff = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 5 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const searchFilter = query ? {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { role: { $regex: query, $options: 'i' } },
      ],
    } : {};

    const staffList = await Staff.find(searchFilter)
      .skip(skip)
      .limit(limitNum);

    const totalDocuments = await Staff.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: staffList,
      totalPages: totalPages,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Lấy chi tiết 1 Nhân viên
 */
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ data: staff });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Tạo Nhân viên mới
 */
const createStaff = async (req, res) => {
  try {
    const { id, name, phone, role, license, status } = req.body;

    // (Bạn có thể thêm validation ở đây, ví dụ: kiểm tra SĐT)

    const newStaff = new Staff({
      id, // Mã NV (ví dụ: NV001)
      name,
      phone,
      role,
      license,
      status,
    });

    await newStaff.save();
    res.status(201).json({ message: 'Staff created successfully' });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Cập nhật Nhân viên
 */
const updateStaff = async (req, res) => {
  try {
    const { name, phone, role, license, status } = req.body;

    const staff = await Staff.findByIdAndUpdate(
      req.params.id, 
      { name, phone, role, license, status }, 
      { new: true } // Trả về tài liệu đã cập nhật
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ message: 'Staff updated' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Xóa Nhân viên
 */
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};