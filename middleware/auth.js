import jwt from "jsonwebtoken";

export const verifyToken = async (req,res,next) =>{


    try {
        const {token} = await req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;

        if (!token) {

            return res.status(403).send({ message: "Access Denied"});


        } else {
            await jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
                if (err){
                    throw err;
                }


                const user = userData

                if(!user){
                    return res.status(403).send({ message: "Access Denied"});
                }


                req.user = user
                next();
            });
        }

    }catch(error){
        return res.status(403).send({ message: `${error}`});
    }

}
