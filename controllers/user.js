const _=require('lodash');
const User=require('../models/user');
const formidable=require('formidable');
const fs=require('fs');

exports.userById=(req,res,next,id)=>{
    //thực hiện tìm kiếm theo Id
    User.findById(id).exec((error,result)=>{
        //nếu không thấy
        if(error || !result){
            return res.status(400).json({
                message:"User not found!"
            })
        }
        //nếu thấy
            //gán kết quả khi tìm được vào thuộc tính mới tạo ( profile ) của request 
        req.profile=result;
        //qua middleware kế tiếp
        next();
    })
}

//nếu được ủy thác

exports.hasAuthorization=(req,res)=>{
    //req.auth có được khi hàm requiredSignin chạy và thêm mới một thuộc tính
    const authorized=req.profile && req.auth && req.profile._id===req.auth._id;
    if(!authorized){
        return res.status(403).json({
            message: "User is not authorized to perform actions"
        })
    }
}

//liệt kê tất cả các users

exports.allUsers=(req,res)=>{
    User.find((err,users)=>{
        if(err||!users){
            return res.status(400).json({
                Error:"User list empty!"
            })
        }
        res.status(200).json(users)
        //.select là để chọn ra những trường nào cần gửi về client
    }).select("email name created updated")
}

//lấy về 1 user

exports.getUser=(req,res)=>{
    //gán 2 cái này bằng undefine để phía client không nhận được 2 thuộc tính này, 
    //nếu mà không làm vậy thì client biết hết pass rồi, khá toang
    req.profile.hashed_password=undefined;
    req.profile.salt=undefined;
    return res.json(req.profile);
}

// cập nhật thông tin User

exports.updateUser=(req,res)=>{
    //cái này hình như có thể thay thế bằng : let form= formidable({ multiples: true });
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    //fields là text các trường, files là file
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"Photo could not be uploaded"
            })
        }
        //save user
        let user=req.profile;
        //nhớ update thì dùng method extend của lodash, update user bằng trường fields trong form
        //mà client gửi lên
        user=_.extend(user,fields);
        user.updated=Date.now();
        if(files.photo){
            user.photo.data=fs.readFileSync(files.photo.path);
            user.photo.contentType=files.photo.type;
        }

        user.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:err
                })
            }
            user.hashed_password=undefined;
            user.salt=undefined;
            //save xong thì nhớ trả về
            res.json(user);
        })
    })
}

//nhận photo từ client

exports.photoUser=(req,res,next)=>{
    if(req.profile.photo.data){
        //res.set(header,value)
        res.set("Content-Type",req.profile.photo.contentType);
        //nhận vô cái gì trả về cái đó
        return res.send(req.profile.photo.data);
    }
    next();
}

//xóa user

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