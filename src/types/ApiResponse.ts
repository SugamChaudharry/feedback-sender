import { Message } from "@/model/User"
export interface ApiReaponse{
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean
    messages?: Array<Message>
}