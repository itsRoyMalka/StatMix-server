import mongoose from "mongoose";
const {Schema} = mongoose;

const EventSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
       type: Boolean,
       default: false
    },
    name: {
        type: String
    },
    location: {
        type: String
    },
    date: {
        type: Date
    },
    description:{
        type: String
    },
    genres: [
        {
            name:{
                type: String
            },
            counter: {
                type: Number,
                default: 0
            }
        }
    ]

    }, { timestamps: true }
);


const Event = mongoose.model("Event", EventSchema);

export default Event;

