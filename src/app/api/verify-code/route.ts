import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request){
    await dbConnect()

    try {
        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if (!user) {
            return Response.json(
                {
                success: false,
                message: "user not found"
                },{status: 500}
            )
        }

        const isCodeValid = user.verifiyCode === code
        const isCodeNotExpired = new Date(user.verifiCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                success: true,
                message: "Account verified successfully"
                },{status: 500}
            )
        }else if (!isCodeNotExpired){
            return Response.json(
                {
                success: true,
                message: "Verification cade has expired please signup again to get a new code"
                },{status: 500}
            )
        }else {
            return Response.json(
                {
                success: true,
                message: "invalid verification code"
                },{status: 500}
            )
        }

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