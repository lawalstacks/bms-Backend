const express = require('express');
const router = express.Router();
const userAuth = require('../controllers/userController');


router.post('/signup',userAuth.signupUser);
router.post('/login',userAuth.loginUser);
module.exports = router;
