import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from "url";
import cookieParser from "cookie-parser";
import axios from "axios";

import publicRoutes from './routes/public.js'
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import {verifyToken} from "./middleware/auth.js";


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    // origin: 'https://statmix.onrender.com' //production
     origin: 'http://10.0.0.8:3000' //dev
}));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//axios.defaults.baseURL = ''
//axios.defaults.withCredentials = true;

/* ROUTES */

app.use('/api/public', publicRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user',verifyToken ,userRoutes)



/* MONGOOSE SETUP */
const PORT = process.env.PORT || process.env.PORT2;
const hostName = process.env.HOST_NAME
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT,() => console.log(`Server host: ${hostName}:${PORT}`));

    })
    .catch((error) => console.log(`${error} did not connect`));
