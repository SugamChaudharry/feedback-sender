import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifiyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "Username is already taken by this email"
                    },
                    {
                        status: 400
                    }
                )
            }else {
                const hasedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hasedPassword
                existingUserByEmail.verifiyCode = verifiyCode
                existingUserByEmail.verifiCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        }else{
            const hasedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifiyCode,
                verifiCodeExpiry: expiryDate,
                isVerified : false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifiyCode
        )

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verifi your email"
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.log("Error registring user", error);
        return Response.json(
            {
                success: false,
                message: "Error registring user"
            },
            {
                status: 500
            }
        )
    }
}