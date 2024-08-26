const Conversation = require('../models/conversation-model.js');
const Message= require("../models/message-model.js");
const {getReceiverSocketId,io}= require("../socket.js")
const sendMessage=async (req, res) => {

    try {
        let sender= req.id;
        let receiver=req.params.id;
        const {message}= req.body;
        if(!message){
            return res.status(400).json({message:"message is required",success:false});
        }
        let conversation = await Conversation.findOne({participants:{$all:[sender,receiver]}});
        let newMessage= await Message.create({sender,receiver,message});
        if(!conversation){
           
        await Conversation.create({
                participants:[sender,receiver],
                messages:[newMessage._id]
            })
    

        }
        else{
            conversation.message.push(newMessage._id);
         await  Promise.all([ conversation.save(), newMessage.save() ]);
        }
        //implement socket io connection
        const receiverSocketId= getReceiverSocketId(receiver)
        if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)}
    
        
        return res.json({newMessage,success:true});

        
        
    } catch (error) {
        return res.status(500).json({message:error.message,success:"false"});
    }
}
const getMessage = async (req,res) => {
try {
    const sender= req.id;
    const receiver=req.params.id;
   
   
  
    const conversation = await Conversation.findOne({participants:{$all:[sender,receiver]}}).populate("message");
   if(!conversation){
    return res.json({messages:[], success: false});
   }
   else{
    return res.json({success:true,messages:conversation?.message});
 
   }

}
catch (error) {
    return res.json({message:error.message,success:false});
    
}




}
module.exports={sendMessage,getMessage}