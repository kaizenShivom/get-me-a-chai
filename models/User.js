import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({

    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: ""
      },
      coverpic: {
        type: String,
        default: ""
      },
      razorpayId: {
        type: String,
        default: ""
      },
      razorpaySecret: {
        type: String,
        default: ""
      },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});


const User = mongoose.models.User;
export default User ? mongoose.model('User') : mongoose.model('User', userSchema);
