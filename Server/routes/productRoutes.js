const express=require('express');
const router=express.Router();
const productCtrl=require('../controllers/productCtrl');

router.route('/products')
.get(productCtrl.getProduct)
.post(productCtrl.createProduct)

router.route('/products/:id')
.delete(productCtrl.deleteProduct)
.put(productCtrl.updateProduct)

router.route('/search').get(productCtrl.searchProduct)
module.exports=router;