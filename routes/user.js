const express=require('express');
const {userById,allUsers,getUser,updateUser,deleteUser,photoUser}=require('../controllers/user');
const {requiredSignin}=require('../controllers/auth');

const router=express.Router();



router.get('/users',allUsers);
router.get('/user/:userId',requiredSignin,getUser);
router.put('/user/:userId',requiredSignin,updateUser);
router.delete('/user/:userId',requiredSignin,deleteUser);
//photo
router.get('/user/photo/:userId',photoUser);
//any routs has userId, our app will execute userById first
router.param('userId',userById);
module.exports=router;