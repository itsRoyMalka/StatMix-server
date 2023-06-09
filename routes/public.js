import express from "express";
import {addEvent, getUser, getUserEvents, editEvent, deleteEvent} from "../controllers/user.js";
import {getEvent, postEvent} from "../controllers/public.js";

const router = express.Router()

router.get('/get-event/:eventId', getEvent)
router.post('/post-event/:eventId', postEvent)



export default router