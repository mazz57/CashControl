import { Schema , model} from 'mongoose';


const UserSchema  = new Schema({
    name: String,
    email: String,
    Password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const userModel = model("User", UserSchema);