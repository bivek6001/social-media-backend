const mongoose= require('mongoose');

const connect= async()=>{
    try {
        await mongoose.connect("mongodb+srv://bivek:8876226687@cluster0.s8afn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to database")
    } catch (error) {
        console.log(error.message)
    }
    
}
module.exports= connect;