const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/total-sale', orderController.getTotalSale);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);

module.exports = router;
