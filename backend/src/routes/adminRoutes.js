// backend/src/routes/adminRoutes.js
const express = require("express"); // Sửa: import -> require

// Sửa: Dùng 'require'
const { 
  createVehicle, 
  getVehicles, 
  getVehicle, 
  updateVehicle, 
  deleteVehicle 
} = require("../controllers/adminController.js");

const router = express.Router();

router.post("/", createVehicle);
router.get("/", getVehicles); 
router.get("/:id", getVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

// (Route 'search' đã bị xóa)

module.exports = router; // Sửa: export default -> module.exports