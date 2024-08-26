const express=require('express');
const router=express.Router();
const authentication= require("../middlewares/authentication.js")
const {newPost,getCommentsOfPost,likeDislike,addComment,userPost,getAllPost,deletePost,bookmarkPost}=require("../controllers/post-controller.js");


router.post("/addPost",authentication,newPost);
router.post("/like/:id",authentication,likeDislike);
router.post("/dislike/:id",authentication,likeDislike);
router.post("/comment/:id",authentication,addComment);
router.get("/comment/all/:id",authentication,getCommentsOfPost);
router.delete("/delete/:id",authentication,deletePost);

router.get("/all",authentication,getAllPost);
router.get("/bookmark/:id",authentication,bookmarkPost)

module.exports = router