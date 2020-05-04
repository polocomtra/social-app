const express=require('express');
const {getPosts,createPost}=require('../controllers/post');
const {requiredSignin}=require('../controllers/auth');
const {createPostValidator}=require('../validator');
const {userById}=require('../controllers/user');

const router=express.Router();

router.get('/',getPosts);
router.post('/post',requiredSignin,createPostValidator,createPost);
router.param('userId',userById);

module.exports=router;