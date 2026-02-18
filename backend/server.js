import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cloudinary from "cloudinary";
import cors from "cors"; // 1. Import CORS
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import connectDB from './db/connectDB.js';
import postRoute from './routes/post.route.js';
import notificationRoute from "./routes/notificationRoute.js";

const app = express();
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

// 2. CONFIGURE CORS (Must be before routes)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoute);

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
    connectDB();
});