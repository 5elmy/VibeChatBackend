import { Router } from "express";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import * as messageController from "../controllers/message.controller.js"
 
 const router = Router()
router.get("/users" ,ProtectRoute ,messageController.getUserForSidebar )
router.get("/:id" ,ProtectRoute , messageController.getMessages)
router.post("/send/:id", ProtectRoute, messageController.sendMessage);

 export default router