import mongoose, {Schema, Document} from 'mongoose'
import { Message } from './Message.model'

export interface User extends Document
{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessages: boolean,
    messages: Message[]
}

const userSchema : Schema<User> = new Schema({
    username:{
        type: String,
        required: [true,"Username is required"],
        unique: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is required"]
    },
    isAcceptingMessages: {
        type: Boolean,
        required: true
    },
    isVerified: {
        type: Boolean,
        //required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }]
})

export const User= (mongoose.models.User as mongoose.Model<User>)||
                        mongoose.model<User>('User', userSchema)