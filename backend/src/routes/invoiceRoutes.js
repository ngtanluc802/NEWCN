// backend/src/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();

const {
  getInvoices,
  getInvoiceById,
  createInvoice, // <-- Import hàm này
  getFormData    // <-- Import hàm này
} = require('../controllers/invoiceController.js');

// GET /api/invoices/formdata (API đặc biệt để lấy data cho form)
router.get('/formdata', getFormData);

// GET /api/invoices (lấy danh sách)
router.get('/', getInvoices);

// POST /api/invoices (tạo mới)
router.post('/', createInvoice);

// GET /api/invoices/:id (lấy chi tiết)
router.get('/:id', getInvoiceById);

// (Không có PUT và DELETE vì là Read-Only)

module.exports = router;