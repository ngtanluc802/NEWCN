// backend/src/controllers/userController.js
const User = require('../models/User'); // (Giả sử model của bạn ở đây)
const bcrypt = require('bcryptjs');

/**
 * TASK 1: (Read) Lấy danh sách Users (Cho Trang Lớp 2)
 */
const getUsers = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 5 } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Logic Tìm kiếm
    const searchFilter = query ? {
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Tìm theo tên
        { email: { $regex: query, $options: 'i' } }, // Tìm theo email
      ],
    } : {};

    const users = await User.find(searchFilter)
      .skip(skip)
      .limit(limitNum);
    
    const totalDocuments = await User.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: users,
      totalPages: totalPages,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * TASK 2: (Read) Lấy chi tiết 1 User (Cho Trang Lớp 3)
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * TASK 3: (Create) Tạo User mới (Cho Trang Lớp 3 - Tạo mới)
 */
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Lỗi: Email này đã tồn tại' });
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo user mới
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'User', // Mặc định là 'User'
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * TASK 4: (Update) Cập nhật User (Cho Trang Lớp 3 - Chỉnh sửa)
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * TASK 5: (Delete) Xóa User
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserRole,
  deleteUser,
};