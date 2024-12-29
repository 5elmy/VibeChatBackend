import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.lib.js"
import User from "../models/User.model.js"
import bcrypt from "bcryptjs"
export let signup = async(req,res,next)=>{
   const {fullName , email , password} = req.body;
   console.log({fullName , email , password});
   
   try {
    if(!fullName || !email || !password){
       return  res.status(400).json({message:"All Fields are required"})
    }
    if(password.length <6) return res.status(400).json({message:"Password must be at least 6 characters"})
    const user = await User.findOne({email})
    if(user) return res.status(400).json({message:"Email already exists"})
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)
    const newUser = new User({
        fullName,
        email,
        password:hashedPassword
    })

    if (newUser){
            generateToken(newUser._id , res)
            await newUser.save()
            // res.status(201).json({
            //     _id:newUser._id,
            //     fullName:newUser.fullName,
            //     email:newUser.email,
            //     profilePic:newUser.profilePic,
            // })
            res.status(201).json({message:"success" ,results:newUser})
    }else{
        res.status(400).json({message:"Invaild user data"})
    }
    
} catch (error) {
    console.log("Error in sign up controller" , error.message);
    res.status(500).json({message:"Internal Server Error"})
    
   }
}
export let signin = async(req,res,next)=>{
    let {email , password} = req.body;
    try {
        if(!email || !password) return res.status(400).json({message:"All Fields is required "})
            let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invaild credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password , user.password)
        if(!isPasswordCorrect) return res.status(400).json({message:"Invaild credentials"})
            generateToken(user._id , res)
        res.status(200).json({message:"success" ,results:user})
    } catch (error) {
        console.log("Error in sign in controller" , error.message);
        res.status(500).json({message:"Internal Server Error"});  
    }
}
export let signout = async(req,res,next)=>{
    try {
        res.cookie("jwt" ,"",{maxAge:0})
        res.status(200).json({message:"logged out successfully"})
    } catch (error) {
        console.log("Error in sign out controller" , error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export let updateProfile = async(req,res,next)=>{
    try {
             const {profilePic}= req.body
             const userId= req.user._id
             if(!profilePic) return res.status(400).json({message:"profile picture is required "})
                const uploadresponse = await cloudinary.uploader.upload(profilePic);
            const updateuser = await User.findByIdAndUpdate(userId , {profilePic:uploadresponse.secure_url} , {new:true})

            res.status(200).json({message:"success" , results:updateuser })
    } catch (error) {
        console.log("Error in update profile controller" , error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export let checkAuth = async(req,res,next)=>{
    try {
          res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller" , error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}