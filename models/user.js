const mongoose=require('mongoose');
const {isEmail}=require("validator");
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please enter an email"],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter an password'],
        minlength: [6,,"password must be atleast 6 length character"]
    }
});

userSchema.pre('save',async function(next){
    let salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

userSchema.post('save',function(doc,next){
    console.log('new user was created and saved',doc);
    next();
});

userSchema.statics.login=async function(email,password){
    const user=await this.findOne({email:email});
    if(user){
        let auth=await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        else{
            throw Error('incorrect password');
        }
    }
    throw Error("incorrect email");
}

const User=mongoose.model('user',userSchema);

module.exports=User;