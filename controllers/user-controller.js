const User=require("../models/user-model.js");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken")
const signup= async (req, res) => {
    try {
        const {email,username,password}=req.body;
        if(!email || !password || !username) {
            return res.status(401).json({message: "Something is missing,please check!",success:false});
        }
        const user= await User.findOne({email: email});
        if(user){
            return res.status(401).json({message: "Email already exists!",success: false});
        }
        const hashedPassword= await bcrypt.hash(password,10);
        const newUser= await User.create({email: email,username: username,password: hashedPassword});
        return res.status(200).json({message:"account has been created",success:true});

    } catch (error) {
        
        return res.status(500).json({message: error.message, success: false});
        
    }
};
const signin=async (req, res) => {
    try {
        const {email,password}=req.body;
        if(!email || !password) {
            return res.status(401).json({message: "Something is missing,please check!",success:false});
        }

        let user= await User.findOne({email: email})
        if(!user){
            return res.status(401).json({message: "Invalid email or password!",success: false});
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message: "Invalid email or password!", success: false});
        }
        const token= await jwt.sign({id:user._id},"secret");
        
        res.set("token",token)
        return res.json({message:`welcome back ${user.username} `,success:true,user});

        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
        
        
    }
}


const logout= async (req, res) => {

    try {
        return res.cookie("token", "", {maxAge:0}).json({message:"logged out successfully",success:true})
        
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
        
    }
}
const getProfile= async (req, res) => {
    try {
        const userId=req.params.id;
        const user= await User.findById(userId);
        return res.json({success:true,user})
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
        
    }
}


const editProfile= async (req, res) => {
    try {
        const id= req.id;
        const {bio,gender}=req.body;
        // const profilePicture= req.file;
        // if(profilePicture){

        // }
        const user=await User.findById(id);
        if(!user){
            return res.json({message:"current user not found",success:false});
        }
        if(bio){
            user.bio=bio;
        }
        if(gender){
            user.gender=gender;
        }
        await user.save();
        return res.json({message:"profile updated successfully",success:true,user})


        
    } catch (error) {
        
    }


}
const suggestions= async(req,res)=>{
    try {
        const id= req.id;
        const suggestions= await User.find({_id:{$ne:id}}).select("-password");
        if(!suggestions){
            return res.status(400).json({message:"current user not found",success:false});
        }
        return res.json({success:true,suggestions})
    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}
 const followorunfollow= async(req, res)=>{


    try {
        const userId=req.id;
        const otherUser=req.params.id;
        const followKarneWala= await User.findById(userId);
        const jiskoFollowKarunga= await User.findById(otherUser);
        if(!followKarneWala ||!jiskoFollowKarunga){
            return res.status(400).json({message:"users not found",success:false});
        }
        
        const isFollowing= await followKarneWala.following.includes(otherUser);
        if(isFollowing){
            //unfollow logic
            await Promise.all([
                await User.updateOne({_id:userId},{$pull:{following:otherUser}}),
                await User.updateOne({_id:otherUser},{$pull:{followers:userId}})
            ])
            return res.json({message: "unfollowed successfully",success:true})
        
        }else{
            //follow logic
            await Promise.all([
                await User.updateOne({_id:userId},{$push:{following:otherUser}}),
                await User.updateOne({_id:otherUser},{$push:{followers:userId}})
            ])
            return res.json({message: "followed successfully",success:true})
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
        
    }
}


module.exports= {signup,signin ,logout,followorunfollow,suggestions,editProfile,}