const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const authRoute=require('./routes/authRoutes');
const cookieParser=require('cookie-parser');
const {requireAuth,checkUser}=require('./middleware/authMiddleware');
require('dotenv').config();
const app=express();
const port=process.env.PORT;
const dbURI=process.env.DB;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.set('view engine','ejs');

mongoose.set("strictQuery", false);
mongoose.connect(dbURI)
    .then((db)=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log(err);
    });

app.listen(port,()=>{
    console.log(`listening to port ${3000}`);
});


app.get('*',checkUser);
app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/smoothies',requireAuth,(req,res)=>{
    res.render('smoothies');
})

app.use(authRoute);
