const express=require('express');
const morgan=require('morgan');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const expressValidator = require('express-validator');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');

dotenv.config();
const app=express();

//routes
const postRoutes=require('./routes/post');
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');



//db
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true,
        useUnifiedTopology: true }).then(()=>{
    console.log('Connect Database successfully!');
})

mongoose.connection.on('error',(error)=>{
    console.log('Connect failed,error');
})




//Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(expressValidator());
app.use(cookieParser());
app.use('/',postRoutes);
app.use('/',authRoutes);
app.use('/',userRoutes);
    //if unauthorized
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error: "Unauthorized"});
    }
  });








//start server


const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Listening on port ${port}.`);
})