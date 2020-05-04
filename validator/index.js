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

exports.signupValidator=(req,res,next)=>{
    //name
    req.check('name',"Name is required").notEmpty();

    //email
    req.check('email','Email must between 4 and 32').matches(/.+\@.+\..+/).withMessage('Email must contains @').isLength({min:4,max:32});
    //password
    req.check('password',"Password is required").notEmpty();
    req.check('password').isLength({min:6})
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must has at least 1 digit number")
    //errors
    const errors=req.validationErrors();
    if(errors){
        const firstError=errors.map((error)=>error.msg)[0];
        return res.status(400).json({error:firstError});
    }
    next();
}