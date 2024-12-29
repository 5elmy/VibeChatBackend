import {Router} from "express"
import * as authController from "../controllers/auth.controller.js"
import { ProtectRoute } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/signup",authController.signup)

router.post("/signin", authController.signin)
router.post("/signout", authController.signout)
router.put("/update-profile",ProtectRoute ,authController.updateProfile)
router.get("/check",ProtectRoute ,authController.checkAuth)


export default router