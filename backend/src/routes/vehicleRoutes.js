// backend/src/routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();

// Import 5 hàm từ controller
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController.js');

router.get('/', getVehicles);
router.post('/', createVehicle);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;