const express=require('express');
const {signup,signin,signout}=require('../controllers/auth');
const {userById}=require('../controllers/user');
const {signupValidator}=require('../validator');

const router=express.Router();


router.post('/signup',signupValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);

//bất cứ một lối nào chứa Endpoint là :userId, thì sẽ thực thi userById trước
router.param('userId',userById);


module.exports=router;