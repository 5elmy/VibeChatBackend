import {v2 as cloudinary} from "cloudinary"
import {config} from "dotenv"


config()

cloudinary.config({
    cloud_name:process.env.CLOUDNAME,
    api_key:process.env.CLOUDNARY_API_KEY,
    api_secret:process.env.CLOUDNARY_API_SECRET
});

export default cloudinary