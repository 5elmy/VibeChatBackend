import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.io.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";



export let getUserForSidebar =async(req,res,next)=>{
    try {
        
        const loggedUserId = req.user._id;
        const filterUser = await User.find({_id:{$ne:loggedUserId}}).select("-password");
        res.status(200).json({message:"Success", results:filterUser}); 
    } catch (error) {
        console.log("Error in getUserForSidebar", error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}

export  const getMessages = async(req,res,next)=>{
    try {
        const {id:receiverId} = req.params
        const senderId = req.user._id
        const messages = await Message.find({
            $or:[{senderId:senderId , receiverId:receiverId}, 
                {senderId:receiverId , receiverId:senderId}]
        })
        res.status(200).json({message:"Success" , results:messages})
    } catch (error) {
        console.log("Error in getmessages", error.message);
        res.status(500).json({error:"Internal server error"})
    }
}


export const sendMessage = async(req,res,next)=>{

    try {
        
        const {image , text} = req.body
        const {id:receiverId} = req.params;
        const senderId = req.user._id
        let imageUrl;
        if(image){
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl=uploadImage.secure_url;
        }
        const newMessage = Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
    
        await newMessage.save(); 
        
        const receiverSoketId = getReceiverSocketId(receiverId);
        if(receiverSoketId){
            io.to(receiverSoketId).emit("results", newMessage)
        }
        res.status(201).json({message:"Success" , results:newMessage})
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({error:"Internal server error"})
    }
}