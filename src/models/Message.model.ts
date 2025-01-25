import mongoose, {Schema, Document} from 'mongoose'

export interface Message extends Document
{
    content: string,
    createdAt: Date,
}

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true
    }
})

export const Message= (mongoose.models.Message as mongoose.Model<Message>)||
                        mongoose.model<Message>('Message', MessageSchema)