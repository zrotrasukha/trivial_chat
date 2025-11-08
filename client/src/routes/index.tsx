import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import JoinBox from './components/JoinBox'
import ChatBox, { type ChatMessage } from './components/ChatBox'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const [join, setJoin] = useState(false)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            username: "CJ",
            message: "shit here we go again", 
        }
    ])
    const [username, setUsername] = useState("")
    const ws = useRef<WebSocket | null>(null)

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:3000/chat')
        ws.current.onopen = () => {
            console.log('WebSocket Client Connected');
        }

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages(prev => [...prev, {
                username: data.username,
                message: data.message
            }]);
        }

        return () => ws.current?.close()
    }, [])
    return (
        <div className='h-screen w-screen bg-black flex items-center justify-center'>
            {join ?
                <ChatBox
                    ws={ws}
                    messages={messages}
                    setMessages={setMessages}
                    message={message}
                    setMessage={setMessage}
                    username={username}
                    setUsername={setUsername}
                />
                :
                <JoinBox
                    username={username}
                    ws={ws}
                    setJoin={setJoin}
                    setUsername={setUsername}
                />
            }
        </div>

    )
}
