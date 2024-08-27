const express=require("express");
const app = express();
const http = require("http");
const server= http.createServer(app);

const {Server} =require("socket.io")

const io= new Server(server,{
    cors: {
        origin: "https://social-media-frontend-oahk.onrender.com",
        methods: ["GET", "POST"]
    }
})

const userSocketMap={

}
const getReceiverSocketId= (receiverId)=>{
    return userSocketMap[receiverId];
}

io.on("connection",(socket)=>{
    const userId= socket.handshake.query.userId;
   
    if(userId){
        userSocketMap[userId]=socket.id;
        console.log(userSocketMap)
        
    }
    console.log(socket.id)
    io.emit("getOnlineUser",Object.keys(userSocketMap))
    socket.on("disconnect",()=>{
        if(userId){
        delete userSocketMap[userId];}
        io.emit("getOnlineUser",Object.keys(userSocketMap))
    })
})


module.exports ={app,server,io,getReceiverSocketId}