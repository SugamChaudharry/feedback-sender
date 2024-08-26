import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/User'
import React, { useState } from 'react'

function page() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loding, setLoding] = useState(false)
    const [isSwitchLoding, setIsSwitchLoding] = useState(false)

    const {toast} = useToast()

  return (
    <div>User Dashboard</div>
  )
}

export default page