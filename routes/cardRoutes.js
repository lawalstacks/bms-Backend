const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const protectedRoute = require('../middlewares/protectedRoute');

router.post('/create',protectedRoute, cardController.create);
router.put('/update/:id',protectedRoute, cardController.update);
router.get('/:slug',cardController.getCard);
router.post('/delete/:slug',protectedRoute, cardController.deleteCard);

module.exports = router;