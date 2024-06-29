const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const protectedRoute = require('../middlewares/protectedRoute');

router.post('/create',protectedRoute, cardController.create);
router.post('/update/:id',protectedRoute, cardController.update);
router.post('/:title',cardController.getCard);
//router.post('/card/delete', cardOptions.create);

module.exports = router;