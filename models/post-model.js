const mongoose=require('mongoose');

const postSchema= new mongoose.Schema({
    caption:{
        type:String,
        required:true,
        default:""
    },
    image:{
        type:String,
       
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
    
},{timestamps:true});


const Post= mongoose.model('Post',postSchema); 

module.exports=Post;