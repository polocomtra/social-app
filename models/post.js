const mongoose=require('mongoose');


const postSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true,
       
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    //thuộc tính này trỏ đến Model User ( tức là thuộc tính này là một User )
    // nếu dùng trỏ kiểu này thì type:mongoose.Schema.ObjectId
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    created:{
        type:Date,
        default:Date.now()
    }
});

module.exports=mongoose.model("Post",postSchema);