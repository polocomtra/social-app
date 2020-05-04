const _=require('lodash');
const User=require('../models/user');

exports.userById=(req,res,next,id)=>{
    User.findById(id).exec((error,result)=>{
        if(error || !result){
            return res.status(400).json({
                message:"User not found!"
            })
        }
        //add new property to req
        req.profile=result;
        next();
    })
}

exports.hasAuthorization=(req,res)=>{
    const authorized=req.profile && req.auth && req.profile._id===req.auth._id;
    if(!authorized){
        return res.status(403).json({
            message: "User is not authorized to perform actions"
        })
    }
}

exports.allUsers=(req,res)=>{
    User.find((err,users)=>{
        if(err||!users){
            return res.status(400).json({
                Error:"User list empty!"
            })
        }
        res.status(200).json({users})
    }).select("email name created updated")
}

exports.getUser=(req,res)=>{
    req.profile.hashed_password=undefined;
    req.profile.salt=undefined;
    return res.json(req.profile);
}

exports.updateUser=(req,res)=>{
    let user=req.profile;
    user=_.extend(user,req.body);
    user.updated=Date.now();
    user.save((err)=>{
        if(err){
            return res.status(400).json({
                error:"You are not authorized to perform this action"
            })
        }
        user.hashed_password=undefined;
        user.salt=undefined;
        res.json({user})
    })
}

exports.deleteUser=(req,res)=>{
    let user=req.profile;
    user.remove((err)=>{
        if(err){
            return res.status(404).json({
                error:"You are not authorized to perform this action"
            })
        }
        user.hashed_password=undefined;
        user.salt=undefined;
        res.json({
            message:"Delete user successfully!"
        })
    })
}