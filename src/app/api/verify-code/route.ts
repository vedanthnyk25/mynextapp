import {z} from 'zod';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User.model';
import { verifySchema } from '@/schema/verifySchema';

const VerifyCodeSchema= z.object({
    code: verifySchema
})

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, code}= await request.json();
        const validatedCode= VerifyCodeSchema.safeParse({code});
        if(!validatedCode) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code"
                }
            )
        }
        const decodedUsername= decodeURIComponent(username);
        const user= await User.findOne({
            username:decodedUsername
        })
        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User does not exist!"
                },
                {
                    status:400
                }
            )
        }
        const isCodeValid= user.verifyCode===code
        const isCodeNotExpired= user.verifyCodeExpiry> new Date()
        
        if(isCodeValid&&isCodeNotExpired){
            user.isVerified= true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "User verified successfully"
                },
                {
                status: 200
                }             
            )
        }
        else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired. Please sign up again to get new verification code"
                },
                {
                    status:500
                }
            ) 
        }
        else{
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code"
                },
                {
                    status:500
                }
            )
        }

    } catch (error) {
        console.error("Error verifying code", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {
                status:500
            }
        )
        
    }
}