import mongoose from "mongoose";
const {Schema} = mongoose;

const UserSchema = new Schema({

        firstName:{
            type: String
        },
        lastName:{
            type: String
        },
        email:{
            type: String
        },
        password: {
            type: String
        },
        imageUrl:{
            type: String,
            default: "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"
        },

        events: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Event'
            }
        ],

        genres: [
            {
                name: {
                    type: String
                },
                description: {
                    type: String
                },
                isActive: {
                    type: Boolean,
                    default: true
                },
                imageUrl:{
                    type: String,
                    default: ''
                },
                totalVotes:{
                    type: Number,
                    min: 0
                }
            }
        ]




    }, { timestamps: true }
);


const User = mongoose.model("User", UserSchema);

export default User;

