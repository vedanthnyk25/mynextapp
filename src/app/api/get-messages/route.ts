import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User.model";
import { authOptions } from "../auth/[...nextauth]/options";
import {User as naUser} from 'next-auth'
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

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
    const userId= new mongoose.Types.ObjectId(user._id);

    try {
        const user= await User.aggregate([
            {
                $match: {id:userId}},
            {
                $unwind: '$messages'
            },
            {
                $sort: {'$messages.createdAt':-1}
            },
            {
                $group:{_id: '$_id', messages:{
                    $push:'$messages'
                }}
            }
            
        ])

        if(!user || user.length===0){
            return Response.json(
                {   success: false,
                    message:"User does not exist"
                },
                {
                    status:404
                }
            )
        }
        return Response.json(
            {   success: true,
                message: user[0].messages
            },
            {
                status:400
            }
        )
        
    } catch (error) {
        console.log("failed to get the messages!")
        return Response.json(
            {   success: false,
                message:"failed to get the messages!"
            },
            {
                status:400
            }
        )
    }

}