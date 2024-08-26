const express=require('express');

 const router=express.Router();
 const {signup,signin,logout,followorunfollow,suggestions, editProfile}=require("../controllers/user-controller.js");
 const authentication= require("../middlewares/authentication.js")


 router.post("/signup",signup);
 router.post("/signin",signin);
 router.get("/logout",logout);
//  router.get("")
 router.post("/profile/edit",authentication,editProfile);
 router.get("/suggestions",authentication,suggestions);
 router.get("/followorunfollow/:id",authentication,followorunfollow);
 module.exports = router;
