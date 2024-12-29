
import express from "express"
import  authRouter  from "./routes/auth.router.js"
import messageRouter from "./routes/message.router.js"
import dotenv from "dotenv"
import cors from"cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js"
import { app, server } from "./lib/socket.io.js"

dotenv.config()
const port = process.env.PORT
 app.use(cors({origin:"*", credentials:true}))
//  app.use(cors({origin:["http://localhost:5173","https://vibe-chat-frontend.vercel.app"] , credentials:true}))
 app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser()) 
app.use(express.json());
app.use("/api/auth", authRouter )
app.use("/api/messages", messageRouter )
  
 connectDB()
app.get('/', (req, res) => res.send('Hello World!'))
server.listen(port, () => console.log(`Example app listening on port ${port}!`))