const jwt=require('jsonwebtoken');
require ('dotenv').config();
const expressJwt=require('express-jwt');
const User=require('../models/user');

exports.signup= async (req,res)=>{
    //check if user's already exist
    const existUser=await User.findOne({email:req.body.email});
    if(existUser){
        return res.status(403).json({
            error:"Email has already taken!"
        })
    }
    const newUser=await new User(req.body);
    await newUser.save();
    res.status(200).json({ message:"Signup successfully!" });
}

exports.signin=(req,res)=>{
    const {email,password}=req.body;
    User.findOne({email},(err,user)=>{
        if(err||!user){
            return res.status(401).json({
                error:"Email is not valid, please try again!"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Password is not valid, please try again!"
            })
        }
        //match user
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
        res.cookie("t",token,{expire: new Date()+9999});
        const {_id,name,email}=user;
        return res.json({token,user:{_id,name,email}});
    });
}

exports.signout=(req,res)=>{
    res.clearCookie("t");
    return res.status(200).json({
        message:"Sign out successfully!"
    })
}

exports.requiredSignin=expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth"
});