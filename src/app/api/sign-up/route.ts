import dbConnect from '@/lib/dbConnect';
import {User} from '@/models/User.model';
import { sendVerificationEmail } from '@/helpers/sendEmailVerification';
import bcrypt from 'bcryptjs';


export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, email, password} = await request.json();

        const existingVerifiedUserbyUsername= await User.findOne({
            username,
            isVerified: true
    })
    if (existingVerifiedUserbyUsername){ {
        Response.json(
            {
            message: "User already exists",
            success: false
        },
        {
            status: 400
        }
        )
    }
    const existingUserbyEmail= await User.findOne({ email });
    const verifyCode= Math.random().toString().slice(2,8);
    if(existingUserbyEmail){
        if(existingUserbyEmail.isVerified){
            return Response.json(
                {
                message: "User already exists",
                success: false
            },
            {
                status: 400
            }
            )
        }
        else{
            const hashedPassword= await bcrypt.hash(password, 12);
            existingUserbyEmail.password= hashedPassword;
            existingUserbyEmail.verifyCode= verifyCode;
            existingUserbyEmail.verifyCodeExpiry= new Date(Date.now()+3600000);

            await existingUserbyEmail.save();
        }

    }
    else{
        const hashedPassword= await bcrypt.hash(password, 12);
        const expiryDate= new Date();
        expiryDate.setHours(expiryDate.getHours()+1);

        const newUser= new User({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: []
        })

        await newUser.save();

        const emailResponse= await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )
        if(!emailResponse.success){
            return Response.json(
                {
                message: emailResponse.message,
                success: false
            },
            {
                status: 500
            }
            )
        }
        return Response.json(
            {
            message: "User created successfully",
            success: true
        },
        {
            status: 201
        }
        )
    }
    
}
    } catch (error) {
        console.log("Error in sign-up route: ", error);
        return Response.json(
            {
            message: "Error in sign-up route",
            success: false
        },
        {
            status: 500
        }
        )
}
}