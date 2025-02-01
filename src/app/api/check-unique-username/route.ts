import {z} from 'zod';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User.model';
import { validateUsername } from '@/schema/signUpSchema';

const UsernameQuerySchema= z.object({
    username: validateUsername
})

export async function GET(request: Request){
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam= {
            username: searchParams.get('username')
        }
        const result= UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameErrors= result.error.format().username?._errors||[];
            return Response.json({
                success: false,
                message: usernameErrors?.length>0? usernameErrors.join(',')
                :'Invalid query parameters'
            },{
                status: 400
            })
        }
        const {username}= result.data
        const existingVerifiedUser= await User.findOne(
            {
                username,
                isVerified: true
            }
        )
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username already exists"
            },{
                status: 409
            })
        }
        return Response.json({
            success: true,
            message: "Username is available"
        },{status: 200})

    } catch (error) {
        console.log("Error verifying username: ", error)
        return Response.json({
            success: false,
            message: "Error verifying username"
        },{
            status: 500
        })
    }
}