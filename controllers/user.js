import User from "../models/User.js";
import Event from "../models/Event.js"

export const getUser = async (req,res) =>{

    return res.status(200).json(req.user)

}

export const getUserEvents = async (req,res) =>{

    try{

        const userId = req.user.id

        const user = await User.findById(userId)

        const events = await Promise.all(
            user.events.map(eventId=> Event.findById(eventId))
        )





        return res.status(200).json(events)



    }catch(error){

        return res.status(500).json({error: error})
    }


}

export const getEvent = async (req,res)=>{

    try{

        const {eventId} = req.params

        const event = await Event.findById(eventId)

        if(event.isActive === false){
            return res.status(400).json({message: 'Event not active yet'})
        }

        return res.status(200).json(event)



    }catch(error){

        return res.status(500).json({error: error})
    }


}

export const getLiveEvent = async (req,res) =>{


    try{

        const userId = req.user.id

        const day = new Date()
        const user = await User.findById(userId)

        const userEvents = await Promise.all(
            user.events.map(eventId=> Event.findById(eventId))
        )



        const filteredEvents = userEvents.filter(ev => {
            return ev.isActive || ev.date.getDate() === day.getDate() || ev.date.getDate() === day.getDate()+1 || ev.date.getDate() === day.getDate()+2
        })



        return res.status(200).json(filteredEvents)

    }catch (error){
        return res.status(500).json({error: error})
    }
}

export const setEventStatus = async (req,res) => {

    try{

        const {eventId} = req.params



        const event = await Event.findById(eventId)


        const bol = event.isActive

        event.isActive = !bol

        await event.save()

        return res.status(200).json({message: "success"})

    }catch(error){
        return res.status(500).json({error: error})
    }

}



export const addEvent = async (req,res)=>{

    try{

        const userId = req.user.id
        const {name,isActive, location, date, description} = req.body

        if(name.length < 2 || date === null){
            return res.status(400).json({message: "name must be at least 2"})
        }

        const user = await User.findById(userId)


        const genres = user.genres

        await genres.forEach(gen=> gen.counter = 0)

    
        
         const userEvents = await Promise.all(
            user.events.map(eventId=> Event.findById(eventId))
        )

        //check only on user - CHANGE ME
        const exist = await userEvents.find(event => event.data === date)

        if(exist){
            return res.status(400).json({message: "Already exist"})
        }


        const newEvent = await Event.create({

            user: userId,
            name,
            isActive,
            location,
            date,
            description,
            genres

        })

        user.events.push(newEvent._id)

        user.save()

        return res.status(200).json({message: "success"})

    }catch(error){
        return res.status(500).json({error: error})
    }


}

export const editEvent = async (req, res) =>{

    try{

        const {id, name, isActive, location, date, description} = req.body

        if(name.length < 2 || date === null){
            return res.status(400).json({message: "name must be at least 2"})
        }

        const newEvent = await Event.findByIdAndUpdate(id, {
            name: name,
            isActive: isActive,
            location: location,
            date: date,
            description: description
        })

        //await newEvent.save()

        res.status(200).json(newEvent)



    }catch(error){
        return res.status(500).json({error: error})
    }

}

export const deleteEvent = async (req,res) =>{

    try{

        const {eventId} = req.params
        const userId = req.user.id

        await Event.findByIdAndDelete(eventId)
        const user = await User.findById(userId)


        user.events = user.events.filter(event => event.toString() !== eventId)

        user.save()

        res.status(200).json({message: 'Success'})



    }catch(error){
        return res.status(500).json({error: error})
    }

}

export const searchEvent = async (req,res)=>{

    try{

        const params = req.body
        const userId = req.user.id

        const user = await User.findById(userId)

        const userEvents = await Promise.all(
            user.events.map(eventId=> Event.findById(eventId))
        )


        const filteredEvents = userEvents.filter(ev => {
            return ev.name === params || ev.name.slice(0,params.length) === params

        })


        return res.status(200).json(userEvents)

    }catch(error){
        return res.status(500).json({error: error})
    }

}

export const addGenre = async (req,res) =>{

    try{


        const userId = req.user.id
        const {name, imageUrl, description} = req.body

        if(name.length < 2){
            return res.status(400).json({message: "name must be at least 2"})
        }

        const user = await User.findById(userId)



        if(user.genres.find(gen=> gen.name === name)){

            return res.status(409).json({message: "already exist"})

        }

        const genre = {
            name,
            imageUrl,
            isActive: true,
            description,
            totalVotes: 0
        }


        user.genres.push(genre)


         user.save()

        return res.status(200).json({message: "success"})


    }catch(error){
        return res.status(500).json({error: error})
    }


}
export const editGenre = async (req,res) =>{

    try{

        const userId = req.user.id
        const {prevName, name,isActive, imageUrl, description} = req.body

        if(name.length < 2){
            return res.status(400).json({message: "name must be at least 2"})
        }

        const user = await User.findById(userId)


        const genre = await user.genres.find(gen=> gen.name === prevName)

        if(!genre){

            return res.status(404).json({message: "not exist"})

        }

        genre.isActive = isActive
        genre.name = name
        genre.imageUrl = imageUrl
        genre.description = description

        user.save()

        return res.status(200).json({message: "success"})

    }catch(error){
        return res.status(500).json({error: error})
    }


}
export const deleteGenre = async (req,res) =>{

    try{

        const userId = req.user.id
        const {genreName} = req.params
        const user = await User.findById(userId)


        user.genres = await user.genres.filter(gen => gen.name !== genreName)

        user.save()

        return res.status(200).json({message: "success"})

    }catch(error){
        return res.status(500).json({error: error})
    }


}

export const getUserGenres = async (req,res) =>{
    try{

        const userId = req.user.id
        const user = await User.findById(userId)





        return res.status(200).json(user.genres)

    }catch(error){
        return res.status(500).json({error: error})
    }

}
