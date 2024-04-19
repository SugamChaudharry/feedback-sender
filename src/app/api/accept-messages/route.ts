import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; 

export async function POST(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "You need to be signed in to send messages"
            }, {status: 401}
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessages: acceptMessages},{new: true});

        if (!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user's acceptMessages status"
                }, {status: 500}
            )
        }

        return Response.json(
            {
                success: true,
                message: `User's acceptMessages status updated to ${acceptMessages}`,
                data: updatedUser
            }, {status: 200}
        )
        
    } catch (error) {
        console.log("failed to update user's acceptMessages status");
        return Response.json(
            {
                success: false,
                message: "You need to be signed in to send messages"
            }, {status: 500}
        )
    }
}

export async function GET(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "You need to be signed in to send messages"
            }, {status: 401}
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
    
        if (!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {status: 404}
            )
        }
    
        return Response.json(
            {
                success: true,
                isACCEPTINGMessages: foundUser.isAcceptingMessage,
                data: foundUser
            }, {status: 200}
        )
    } catch (error) {
        console.log("failed to get user's acceptMessages status");
        return Response.json(
            {
                success: false,
                message: "You need to be signed in to send messages"
            }, {status: 500}
        )
        
    }

} 