import express from "express";
import {Login, Signup, signOut} from "../controllers/auth.js";

const router = express.Router()

router.post('/login', Login)
router.post('/signup', Signup)
router.post('/signout', signOut)

export default router