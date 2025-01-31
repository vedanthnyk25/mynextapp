import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any> {
                await dbConnect();
                try {
                    const user= await User.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found");
                    }
                    const isPasswordCorrect= await bcrypt.compare(credentials.password, user.password);
                    if(!isPasswordCorrect){
                        throw new Error("Password is incorrect");
                    }
                    else return user;
                } catch (error:any) {
                    throw new Error("Error in authorization");
                }

                
            },
        })
    ],
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user.id= token.id;
                session.user.username= token.username;
                session.user.isVerified= token.isVerified;
                session.user.isAcceptingMessages= token.isAcceptingMessages;
            }
            return session
        },
        async jwt({token, user}) {
            if(user){
                token.id= user._id?.toString(); //Note: we will be crrating our own user modifying next auth module
                token.username= user.username;
                token.isVerified= user.isVerified;
                token.isAcceptingMessages= user.isAcceptingMessages;
            }
            return token
        }
    },
    pages:{
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}