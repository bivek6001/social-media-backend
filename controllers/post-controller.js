const User= require("../models/user-model.js")
const Post=require("../models/post-model.js");
const Comment = require("../models/comment-model.js");
const newPost= async (req, res)=>{
    try {
        const {caption}= req.body;
        const author=req.id;
        if(!caption){
            return res.json({message: 'Caption is required',success: false});
        }
        const newPost= await Post.create({caption:caption,author:author})
        const user= await User.updateOne({_id:author},{$push:{post:newPost._id}});
        await newPost.populate({path:"author",select:"-password"})
        return res.status(200).json({message:"Post created successfully",success:true,newPost});

        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}


const getAllPost= async(req,res)=>{
    try {
        const posts= await Post.find().sort({createdAt:-1}).populate({path:"author",select:"username ,profilePicture"}).populate({path:"comments",sort:{createdAt:-1}})
        return res.status(200).json({message:"all posts",success:true,posts});

    } catch (error) {
        return res.json({message: error.message, success: false});
    }
}
const userPost= async(req,res)=>{

    try {
        const userId= req.id;
        const posts= await Post.find({author: userId}).sort({createdAt:-1}).populate({path:"author",select:"username,profilePicture"}).populate({path:"comment",sort:{createdAt:-1},populate:{path:"author",select:"username,profilePicture"}})
        return res.json({success:true,posts})

    } catch (error) {
        return res.json({message: error.message, success: false});
    }
}

const likeDislike= async (req, res)=>{
    try {
        const user= req.id;
        const postId= req.params.id;
        
        const post= await Post.findById(postId);
        if(!post){
            return res.json({message: 'Post not found', success: false});
        }
        const alreadyLiked= post.likes.includes(user);
        if(alreadyLiked){
            await post.updateOne({$pull:{likes:user}});
            await post.save();
            return res.json({message: 'Unliked post', success: true, post});
        }
        else{
            await post.updateOne({$push:{likes:user}});
            await post.save();
            return res.json({message: 'Liked post', success: true, post});
        }
        
    } catch (error) {
        return res.json({message: error.message, success: false});
    }
}


const addComment= async(req,res)=>{

    try {
        const postId= req.params.id;
        const user= req.id;
        const {text}=req.body;
        const post= await Post.findById(postId);
        if(!text){
            return res.json({message: 'Text is required', success: false});
        }
        const comment= (await Comment.create({text,author:user,post:postId})).populate({path:"author",select:"username,profilePicture"})
        post.comments.push(comment._id);
        await post.save();
        return res.json({message:"comment added",success:true,comment});

        
    } catch (error) {
        
    }
}

const getCommentsOfPost= async(req,res)=>{
    try {
        const postId= req.params.id;
        const comments= await Comment.find({post:postId}).populate("author","username,profilePicture");
        if(!comments){
            return res.json({message: 'No comments found', success: false});
        }
    } catch (error) {
    
        return res.status(500).json({message: error.message, success: false});
    }
}
const deletePost= async (req, res)=>{
    try {
        const postId=req.params.id;
        const authorId= req.id;
        const post= await Post.findById(postId);
        if(!post){
            return res.json({message: 'Post not found', success: false});
        }
        if(post.author.toString() !== authorId){
            return res.json({message: 'Unauthorized to delete this post', success: false});
        }

        //remove post from user info
        await Post.findByIdAndDelete(postId);

        let user= await User.findById(authorId)
        user.post=user.post.filter(p=>p.toString()!== postId)
        await user.save()
        //remove all the comments of this post
        await Comment.deleteMany({post:postId})
        return res.json({message: "post deleted", success: true});

    } catch (error) {
            return res.json({message:error.message,success:false});
    }
}


const bookmarkPost= async (req, res) => {


    try {
        const postId= req.params.id;
        const authorId= req.id;

        const post= await Post.findById(postId);
        if(!post){
            return res.json({message: 'Post not found', success: false});
        }
        const user=await User.findById(authorId);
        if(!user){
            return res.json({message: 'User not found', success: false});
        }
        if(user.bookmarks.includes(postId)){
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.json({message: 'Unbookmarked post', success: true});
        }else{
            await user.updateOne({$push:{bookmarks:post._id}});
            await user.save();
            return res.json({message: 'Bookmarked post', success: true});     
        }
     
        
    } catch (error) {
        return res.json({message:error.message,success:false});
    }
}

module.exports={newPost,getCommentsOfPost,likeDislike,addComment,userPost,getAllPost,deletePost,bookmarkPost};