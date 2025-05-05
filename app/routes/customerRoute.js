const express = require('express');
const router = express.Router();


const CustomerController = require('../controller/CustomerController');

router.get('/customer', CustomerController.homepage);
router.get('/customer/home/filter', CustomerController.homepageFilter);
router.get('/customer/product/:slug', CustomerController.productDetail);
router.get('/customer/product/:id', CustomerController.productDetail);

module.exports = router;