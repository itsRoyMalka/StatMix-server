import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req, res) =>{

    try {

        const { email, password} = req.body;

        const user = await User.findOne({email})

        if(!user){

            return res.status(401).json({message: `User not found `})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){

            return res.status(401).json({ message: "Invalid credentials. " });
        }

        jwt.sign({

                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id,
                imageUrl: user.imageUrl
            },
            process.env.JWT_SECRET,  {expiresIn: "12h"}, (error,token) =>{
                if(error){
                    throw error;
                }


                res.cookie('token', token, {sameSite: 'none', secure: true })

                res.status(201).json({token, user})

            })

    } catch(error){

        res.status(500).json({message: `${error} `})
    }


}

export const Signup = async (req, res) =>{

    try{

        const { firstName, lastName, email, password, imageUrl} = req.body

       if(firstName.length < 2 || lastName.length < 2 || email.length < 5 || password.length < 6){
           return res.status(400).json({message: "Invalid input"})
       }


        const user = await User.findOne({email})

        if(user){
            res.status(400).json({message: "User already exist"})
            return;
        }


        const salt = await bcrypt.genSalt(12)
        const hash = await bcrypt.hash(password, salt)


        await User.create({
            firstName,
            lastName,
            email,
            password: hash,
            //imageUrl

        })

        res.status(201).json({message: "Successes"})



    }catch(error){
        res.status(500).json({error: error})
    }

}

export const signOut = async (req,res) =>{

    res.clearCookie('token').status(200).json(true);

}
