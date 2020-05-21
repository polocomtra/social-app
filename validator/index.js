exports.createPostValidator=(req,res,next)=>{
    //title
    req.check('title','Title is required').notEmpty();
    req.check('title','Title must between 4 and 150 characters').isLength({
        min:4,
        max:150
    });
    // body
    req.check('body','Body is required').notEmpty();
    req.check('body','Body must between 4 and 2000 characters').isLength({
        min:4,
        max:2000
    });
    //another error
    const errors=req.validationErrors();
    if(errors){
        const firstError=errors.map((error)=>error.msg)[0];
        return res.status(400).json({error:firstError});
    }
    next();
}


//kiếm tra các thuộc tính đăng kí có hợp lệ hay không
exports.signupValidator=(req,res,next)=>{
    //kiểm tra tên
        //tham số 1: field to check
        //tham số 2: nếu fail thì xuất câu message này
    req.check('name',"Name is required").notEmpty();

    //email
        //lần lượt check field email, nếu fail xuất message đầu tiên, tiếp theo kiểm tra có match với RegEx kia không ? nếu không thì xuất message trong withMessage ,...
    req.check('email','Email must between 4 and 32').matches(/.+\@.+\..+/).withMessage('Email must contains @').isLength({min:4,max:32});
    //password
        //nếu muốn kiểm tra not Empty thì nhớ tách câu check ra 
    req.check('password',"Password is required").notEmpty();
        //tuần tự biên dịch như trên
    req.check('password').isLength({min:6})
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must has at least 1 digit number")
    //các lỗi còn lại
    const errors=req.validationErrors();
    if(errors){
        const firstError=errors.map((error)=>error.msg)[0];
        return res.status(400).json({error:firstError});
    }
    next();
}