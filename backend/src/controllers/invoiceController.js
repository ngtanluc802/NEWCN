// backend/src/controllers/invoiceController.js
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Schedule = require('../models/Schedule'); // <-- Quan trọng, cần để update
const Route = require('../models/Route');

const ITEMS_PER_PAGE = 5;

/**
 * Lấy danh sách Hóa đơn
 */
const getInvoices = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const searchFilter = {};
    if (query) {
      const searchRegex = { $regex: query, $options: 'i' };
      const matchingUsers = await User.find({ 
        $or: [{ name: searchRegex }, { email: searchRegex }] 
      }).select('_id');
      searchFilter.user = { $in: matchingUsers.map(u => u._id) };
    }

    const invoices = await Invoice.find(searchFilter)
      .populate('user', 'name email')
      .populate({
        path: 'schedule',
        populate: { path: 'route', model: 'Route', select: 'name' }
      })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const totalDocuments = await Invoice.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      data: invoices,
      totalPages: totalPages,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Lấy chi tiết 1 Hóa đơn
 */
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('user')
      .populate({
        path: 'schedule',
        populate: [
          { path: 'route', model: 'Route' },
          { path: 'vehicle', model: 'Vehicle' }
        ]
      });
      
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ data: invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * TASK 11 (CUD): Tạo Hóa đơn mới
 * (ĐÃ SỬA LỖI - Tự động cập nhật 'bookedSeats')
 */
const createInvoice = async (req, res) => {
  try {
    const { schedule, seats } = req.body;

    // 1. Tạo hóa đơn mới
    const invoice = new Invoice(req.body);
    await invoice.save();

    // 2. Cập nhật 'bookedSeats' trong Lịch trình (Schedule)
    // '$inc' sẽ cộng dồn 'seats.length' (số lượng ghế) vào 'bookedSeats'
    if (seats && seats.length > 0) {
      await Schedule.findByIdAndUpdate(schedule, { 
        $inc: { bookedSeats: seats.length } 
      });
    }

    res.status(201).json({ message: 'Invoice created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

/**
 * (Helper) Lấy dữ liệu cho Form (Users + Schedules)
 */
const getFormData = async (req, res) => {
  try {
    const users = await User.find().select('name email _id');
    const schedules = await Schedule.find({ 
      status: { $in: ['Đang bán', 'Sắp mở bán'] } 
    })
    .populate('route', 'name')
    .populate('vehicle', 'plateNumber')
    .sort({ departureTime: 1 });

    res.json({
      users,
      schedules,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  getFormData,
};