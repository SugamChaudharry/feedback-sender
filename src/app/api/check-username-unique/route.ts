import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod\
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("result",result);
        if (!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameError?.length > 0 ? usernameError.join(", ") : " Invalind query parameters",
                },{status: 400}
            )
        }

        const {username} = result.data
        const existingVerrifyUser = await UserModel.findOne(
            {username, isVerified: true}
        )

        if (existingVerrifyUser){
            return Response.json(
                {
                success: false,
                message: "username is alrady taken"
                },{status: 400}
            )
        }
        return Response.json(
            {
            success: true,
            message: "username is unique"
            },{status: 200}
        )
    } catch (error) {
        console.log("error checking username" , error);
        return Response.json(
            {
            success: false,
            message: "error checking username"
            },{status: 500}
        )
        
    }
}