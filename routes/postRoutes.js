const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const protectedRoute = require('../middlewares/protectedRoute');

router.post('/create', protectedRoute,postController.create);
router.post('/update/:id',protectedRoute,postController.update);
router.get('/:slug',postController.getPost);
router.post('/delete/:slug',protectedRoute,postController.deletePost);


module.exports = router;
