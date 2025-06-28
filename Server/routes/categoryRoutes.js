const express=require('express');
const router = express.Router();
const auth=require('../middlewares/auth');
const authAdmin=require('../middlewares/authAdmin');
const categoryCtrl=require('../controllers/categoryCtrl');

router.route('/category')
.get(categoryCtrl.getCategory)
.post(auth,authAdmin,categoryCtrl.createCategory)

router.route('/category/:id')
.delete(auth,authAdmin,categoryCtrl.deleteCategory)
.put(auth,authAdmin,categoryCtrl.updateCategory);

module.exports=router;