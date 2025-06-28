const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middlewares/auth');


router.post('/addcart', auth, userCtrl.addCart);
router.post('/deleteCart/:id',auth,userCtrl.deleteCart);
router.post('/register', userCtrl.registerUser)
router.get('/refresh_token', userCtrl.refreshToken);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);
router.get('/info',auth,userCtrl.getUser);
router.post('/address',auth,userCtrl.UpdateAddress);
router.post('/delete_address',auth,userCtrl.DeleteAddress);

module.exports = router;