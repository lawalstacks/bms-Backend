const express = require('express');
const router = express.Router();
const create = require('../controllers/cardController');
const protectedRoute = require('../middlewares/protectedRoute');


router.post('/create',protectedRoute,create);
//router.post('/card/edit', cardOptions.create);
//router.post('/card/delete', cardOptions.create);

module.exports = router;