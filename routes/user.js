import express from "express";
import {
    addEvent,
    getUser,
    getUserEvents,
    editEvent,
    deleteEvent,
    addGenre,
    editGenre,
    deleteGenre, getUserGenres, getEvent, getLiveEvent, setEventStatus
} from "../controllers/user.js";

const router = express.Router()

router.get('/get-user', getUser)
router.get('/get-user-event/:eventId', getEvent)
router.get('/get-user-events', getUserEvents)
router.get('/get-user-genres', getUserGenres)
router.get('/get-live-event', getLiveEvent)

router.post('/add-event', addEvent)
router.post('/add-genre', addGenre)

router.patch('/edit-event', editEvent)
router.patch('/edit-genre', editGenre)
router.patch('/set-event-status/:eventId', setEventStatus)

router.delete('/delete-event/:eventId', deleteEvent)
router.delete('/delete-genre/:genreName', deleteGenre)


export default router