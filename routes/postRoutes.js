const express = require('express');
const router = express.Router();
const postControl = require('../controllers/postController');
const protectedRoute = require('../middlewares/protectedRoute')

router.post('/create', protectedRoute,postControl.create);
router.post('/update/:id',protectedRoute,postControl.update)

module.exports = router;
