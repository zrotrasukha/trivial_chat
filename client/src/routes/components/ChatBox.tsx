import { useEffect, useRef } from "react"

export interface ChatMessage {
    username: string;
    message: string;
}

interface ChatBoxProps {
    ws: React.RefObject<WebSocket | null>;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    username: string;
    setUsername?: React.Dispatch<React.SetStateAction<string>>;
}
export default function ChatBox({ ws, messages, setMessages, message, setMessage, username }: ChatBoxProps) {

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleClick = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
        e.preventDefault()
        if (message.trim() === "") return
        ws.current?.send(JSON.stringify({
            type: 'text',
            message,
            username
        }))
        setMessages(prev => [...prev, {
            username,
            message
        }])
        setMessage("")
    }
    return (
        <div className="bg-zinc-800 h-[600px] w-[600px] rounded-2xl p-4 flex flex-col gap-4 justify-between">
            {/* messages */}

            <div className="overflow-y-auto">
                {
                    messages.length > 0 && messages.map((msg, _) => (
                        <div className="flex gap-2 mb-2 items-center" key={crypto.randomUUID()}>
                            <div className="text-black rounded-full bg-white h-8 w-8 flex justify-center items-center">{msg.username.slice(0, 1).toUpperCase()}</div>
                            <div className="text-white wrap-break-word whitespace-pre-wrap" >
                                {msg.message}
                            </div>
                        </div>
                    ))
                }
                <div ref={messagesEndRef}></div>
            </div>
            <form
                onSubmit={handleClick}
            >
                <input
                    type="text"
                    className="bg-white w-full rounded px-2 py-1 mb-2"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-400 w-full px-4 py-2 rounded hover:bg-blue-300"
                >Send</button>
            </form>


        </div >
    )
}

