const express = require('express');
const router = express.Router();
const userAuth = require('../controllers/userController');
const protectedRoute = require('../middlewares/protectedRoute')

router.get('/google',userAuth.googleAuth);
router.get('/google/callback',userAuth.googleCallback);

module.exports = router;