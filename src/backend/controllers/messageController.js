import Chat from "../models/chatDB.js"

export const getMessages = async (req,res) =>{
    try{
        const messages = await Chat.find()
            .sort({ createdAt: 1})
            .limit(50);
        
        res.json(messages);
    }
    catch(err){
        res.status(500).json({ error: "Failed to fetch messages" }, err);
    }  
}