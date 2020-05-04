const express=require('express');
const {signup,signin,signout}=require('../controllers/auth');
const {userById}=require('../controllers/user');
const {signupValidator}=require('../validator');

const router=express.Router();


router.post('/signup',signupValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);

//any routs has userId, our app will execute userById first
router.param('userId',userById);
module.exports=router;