const Post=require('../models/post');
//cứ đụng tới form update thì dùng formidable
const formidable=require('formidable');
const fs=require('fs');
//cứ update thì Lodash
const _=require('lodash');

//tìm tất cả những post của Id này
exports.getPostById=(req,res,next,id)=>{
    Post.findById(id)
        //tức là hiển thị những thuộc tính này
        //tham số 1: ref của Post
        //tham số 2: thuộc tính bình thường
        .populate("postedBy","_id name")
        .exec((err,post)=>{
            if(err || !post){
                return res.status(400).json({
                    err:err
                })
            }
            //tìm được post rồi tạo mới một thuộc tính rồi gán post vào
            req.post=post;
            next();
        })
}

//lấy tất cả Posts

exports.getPosts=(req,res,next)=>{
    const posts=Post.find().populate("postedBy","_id name").select("_id title body").then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err);
    })
};

//tạo mới một Post

exports.createPost=(req,res,next)=>{
    //cứ đụng form thì Formidable
    let form= new formidable.IncomingForm();
    form.keepExtensions=true;

    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"Image could not be upload"
            })
        }
        //tạo mới post
        let post=new Post(fields);
        req.profile.hashed_password=undefined;
        req.profile.salt=undefined;
        post.postedBy=req.profile;

        if(files.photo){
            post.photo.data=fs.readFileSync(files.photo.path);
            post.photo.contentType=files.photo.type;
        }
        post.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:"What's error?"
                })
            }
            res.json(result);
        })
    })
}

//tìm tất cả các posts của User này

exports.getPostByUser=(req,res)=>{
    Post.find({postedBy:req.profile._id}).populate("postedBy","_id name")
        .sort("created").exec((err,posts)=>{
            if(err){
                return res.status(400).json({
                    error:err
                })
            }
            res.json({posts});
        })
}

//phải là người post hay không

exports.isPoster=(req,res,next)=>{
    let isPoster=req.post && req.auth && req.post.postedBy._id==req.auth._id;
    if(!isPoster){
        return res.status(400).json({
            error:"You are not authorized"
        })
    }
    next();
}

exports.deletePostById=(req,res)=>{
    let post=req.post;
    post.remove((err,result)=>{
        if (err || !result){
            return res.status(400).json({
                error:err
            })
        }
        res.json({
            message:"Delete post successfully"
        })
    })
}

exports.updatePost=(req,res)=>{
    let post=req.post;
    post=_.extend(post,req.body);
    post.updated=Date.now();
    post.save((err,result)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json(post);
    })
}