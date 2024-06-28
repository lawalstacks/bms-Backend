const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const protectedRoute = require('../middlewares/protectedRoute')

router.post('/create',protectedRoute,postController.create);

module.exports = router;
