const express=require('express');
const {getPosts,createPost,getPostByUser,getPostById,isPoster,deletePostById,updatePost}=require('../controllers/post');
const {requiredSignin}=require('../controllers/auth');
const {createPostValidator}=require('../validator');
const {userById}=require('../controllers/user');

const router=express.Router();

router.get('/posts',getPosts);
router.get('/post/by/:userId',requiredSignin,getPostByUser);
router.post('/post/new/:userId',requiredSignin,createPost,createPostValidator);
router.delete('/post/:postId',requiredSignin,isPoster,deletePostById);
router.put('/post/:postId',requiredSignin,isPoster,updatePost);

//any routs has userId, our app will execute userById first
router.param('userId',userById);
//any routs has postId, our app will execute getPostById first
router.param('postId',getPostById);

module.exports=router;