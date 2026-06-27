import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { envVars } from "./config";
import { userRouter } from "./modules/users/user_routes";
import { authRouter } from "./modules/auths/auth_routes";
import { commentRouter } from "./modules/comments/comment_routes";
import { postRouter } from "./modules/posts/post_routes";

const app:Application = express();
app.use(cors({
    origin: envVars.APP_URL,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/api/users", userRouter);
app.use("/api/auths", authRouter);
app.use("/api/comments", commentRouter);
app.use("/api/posts",postRouter);
app.get("/", (req:Request,res:Response)=>{
    res.send("This is prisma press backend server. Please use the API endpoints to interact with the server.")
});

export default app;