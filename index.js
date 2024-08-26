const express= require('express');
const cors=require('cors');
const connect= require("./db.js")
const userRoutes=require("./routers/user-router.js")
const postRoutes=require("./routers/post-router.js")
const messageRoutes=require("./routers/message-router.js")
const cookieParser=require("cookie-parser")
const{app,server,io}=require("./socket.js")

connect();
app.use(cors({
    origin:"https://social-media-frontend-oahk.onrender.com",
    credentials:true
}));

app.use(express.json())
app.use(cookieParser());
app.use("/user",userRoutes);
app.use("/post",postRoutes);
app.use("/message",messageRoutes);



server.listen(9000,()=>{
    console.log('Server is running on port 9000');
})