const express = require('express');
const router = express.Router();
const userAuth = require('../controllers/userController');
const protectedRoute = require('../middlewares/protectedRoute')


router.post('/signup',userAuth.signupUser);
router.post('/login',userAuth.loginUser);
router.post('/logout',userAuth.logoutUser);
router.post('/follow/:id',protectedRoute,userAuth.followUnfollow);
router.post('/update/:id', protectedRoute,userAuth.updateProfile);
router.get('/:username',userAuth.getProfile);
module.exports = router;
