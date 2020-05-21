const jwt=require('jsonwebtoken');
require ('dotenv').config();
const expressJwt=require('express-jwt');
const User=require('../models/user');

exports.signup= async (req,res)=>{
    //kiểm tra xem người dùng đã tồn tại chưa

    const existUser=await User.findOne({email:req.body.email});
        //nếu có
    if(existUser){
        return res.status(403).json({
            error:"Email has already taken!"
        })
    }
        //nếu chưa

    const newUser=await new User(req.body);
    await newUser.save();
    res.status(200).json({ message:"Signup successfully!" });
}

exports.signin=(req,res)=>{
    const {email,password}=req.body;
    //kiểm tra xem email và password hợp lệ không

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
        //nếu hợp lệ
            //thực hiện kí và tạo token
            //tham số 1: thuộc tính gì cần làm token, tham số 2: secret 
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
            //trả về một cookie với name='t' và value=token, tham số thứ 3 là option
            //dùng để duy trì phiên online của khách hàng 

        res.cookie("t",token,{expire: new Date()+9999});
        const {_id,name,email}=user;
            //trả về token vừa đăng kí cùng với thông tin người dùng 

        return res.json({token,user:{_id,name,email}});
    });
}

exports.signout=(req,res)=>{
    //xóa phiên cookie hiện tại thì sẽ đăng xuất
    res.clearCookie("t");
    return res.status(200).json({
        message:"Sign out successfully!"
    })
}

exports.requiredSignin=expressJwt({
    //secret này phải bằng với secret khi đăng kí thì mới đúng Token
    secret:process.env.JWT_SECRET,
    //đặt thêm một property tên là "auth" để dễ dàng xác định là người dùng có đang được ủy quyền hay không
    userProperty:"auth"
});