import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        await mongoose.connect('mongodb://localhost:27017/ChatAppDB');
        console.log("MongoDB Succesfully Connected");
    }
    catch(err){
        if (err instanceof Error) {
            console.error("MongoDB connection error:", err.message)
        } else {
            console.error('Unknown MongoDB connection error');
        }
    }
}

export default connectDB;