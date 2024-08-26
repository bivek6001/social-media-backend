const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png'
    },
    gender:{
        type:String,
        enum:['male', 'female', 'other']
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    post:[{
    
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        
    }],
    bookmarks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }]

    
},{timestamps:true});


const User= mongoose.model('User',userSchema); 

module.exports=User;