import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User.model";
import { Message } from "@/models/Message.model";

import { z } from "zod";
import { messageSchema } from "@/schema/messageSchema";
import { use } from "react";

export async function POST(request: Request){
    await dbConnect();
    const {content, username}= await request.json();

    try {
        const user= await User.findOne(
            {username}
        )
        if(!user){
            return Response.json(
                {   success: false,
                    message:"User not found !"
                },
                {
                    status:404
                }
            )
        }
        if(!user.isAcceptingMessages){
            return Response.json(
                {   success: false,
                    message:"User is not accepting messages!"
                },
                {
                    status:403
                }
            )
        }

        const newMessage = { content, createdAt: new Date() };

        const validatedMessage = messageSchema.safeParse(newMessage);
        
        if (!validatedMessage.success) {
            return Response.json(
                { success: false, message: "Invalid message format!" },
                { status: 400 }
            );
        }
        
        user.messages.push(validatedMessage.data as Message);
        await user.save();

        return Response.json(
            {   success: true,
                message:"Message sent successfully!"
            },
            {
                status:200
            }
        )

    } catch (error) {
        console.log("failed to send the message!")
        return Response.json(
            {   success: false,
                message:"Internal server error!"
            },
            {
                status:500
            }
        )
    }
}