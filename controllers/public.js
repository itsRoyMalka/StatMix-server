import Event from "../models/Event.js"
import User from "../models/User.js";

export const getEvent = async (req,res)=>{

    try{

        const {eventId} = req.params

        const event = await Event.findById(eventId)
        const userId = event.user

        const user = await User.findById(userId)


        const genres =  user.genres.filter(gen => gen.isActive === true)

        const formatted = {
            name: event.name,
            date: event.date,
            location: event.location,
            isActive: event.isActive,
            genres
        }

        return res.status(200).json(formatted)

    }catch(error){
        return res.status(500).json({error: error})
    }

}

export const postEvent = async (req,res)=>{

    try{
        const {eventId} = req.params

        const {vote} = await req.cookies;


        console.log(vote)

        if(vote === eventId){
            return res.status(403).json({message:"access denied"})
        }



        const genres = req.body


        const event = await Event.findById(eventId)

        const userId = event.user
        const user = await User.findById(userId)

        genres.forEach(genre =>{



            const eventGenre = event.genres.find(gen => gen.name === genre)
            const userGenre = user.genres.find(gen => gen.name === genre)



            if(!eventGenre){
                event.genres.push({
                    name: genre,
                    counter: 1
                })
            }else{
                eventGenre.counter++
            }

            userGenre.totalVotes++


        })


        await event.save()
        await user.save()




        res.cookie('vote', `${eventId}`)

        return res.status(200).json({message: "success"})

    }catch(error){
        return res.status(500).json({error: error})
    }

}