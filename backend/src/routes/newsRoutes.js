// backend/src/routes/newsRoutes.js
const express = require('express');
const router = express.Router();

const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController.js');

router.get('/', getNews);
router.post('/', createNews);
router.get('/:id', getNewsById);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

module.exports = router;