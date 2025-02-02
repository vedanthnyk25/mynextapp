import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User.model";
import { authOptions } from "../auth/[...nextauth]/options";
import {User as naUser} from 'next-auth'
import { getServerSession } from "next-auth";

export async function POST(request: Request){
    await dbConnect();

    const session= await getServerSession(authOptions)
    const user: naUser= session?.user as naUser

    if(!session || !session?.user){
        return Response.json({
            success: false,
            message: "Not authorised"
        },
    {
        status: 401
    })
    }
    const {acceptMessages}= await request.json();
    const userId= user._id;

    try {
        const updatedUser= await User.findByIdAndUpdate(
            userId,
            {isAcceptingMessages:acceptMessages},
            {new: true}
        )
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "failed to update the message accepting status!"
                },
                {
                    status: 401
                }
            )
        }
        
        return Response.json(
            {
                success: true,
                message: "Successfully updated the message accepting status!"
                ,updatedUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("failed to update the message accepting status!")
        return Response.json(
            {   success: false,
                message:"failed to update the message accepting status !"
            },
            {
                status:400
            }
        )
    }


}



export async function GET(request: Request){
    await dbConnect();

    const session= await getServerSession(authOptions)
    const user: naUser= session?.user as naUser

    if(!session || !session?.user){
        return Response.json({
            success: false,
            message: "Not authorised"
        },
    {
        status: 401
    })
    }
    const userId= user._id;

    try {
        const foundUser= await User.findById(
            userId
        )
        if(!foundUser){
            return Response.json(
                {   success: false,
                    message:"User not found !"
                },
                {
                    status:404
                }
            )
        }
        return Response.json(
            {   success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            {
                status:200
            }
        )
    } 
    catch (error) {
        console.log("failed to retrieve the message accepting status!")
        return Response.json(
            {   success: false,
                message:"failed to retrieve the message accepting status !"
            },
            {
                status:400
            }
        )
    }
}