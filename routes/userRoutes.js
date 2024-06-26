const express = require('express');
const router = express.Router();
const userAuth = require('../controllers/userController');


router.post('/signup',userAuth.signupUser);
router.post('/login',userAuth.loginUser);
router.post('/logout',userAuth.logoutUser);
module.exports = router;
