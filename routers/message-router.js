const express=require('express');
const router=express.Router();
const authentication= require("../middlewares/authentication.js")
const {sendMessage,getMessage}=require("../controllers/message-controller.js")

router.post("/send/:id",authentication,sendMessage);
router.get("/all/:id",authentication,getMessage);
module.exports = router;