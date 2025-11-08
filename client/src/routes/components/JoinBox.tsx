import type { MouseEvent } from "react";

interface IJoinBoxProps {
    ws: React.RefObject<WebSocket | null>
    setJoin: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    setUsername?: React.Dispatch<React.SetStateAction<string>>;
}
export default function JoinBox({ ws, setJoin, username, setUsername }: IJoinBoxProps) {
    const handleJoin = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault();
        ws.current?.send(JSON.stringify({
            type: 'join',
            message: 'User has joined the chat',
            username
        }))
        setJoin(prev => !prev);
    }
    return (
        <div
            className='h-fit w-[600px] gap-2 bg-zinc-800 rounded-2xl p-2 flex flex-col justify-between'
        >
            <input
                type="text"
                className='bg-white rounded px-2 py-1'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername?.(e.target.value)}
            />
            <button
                className='bg-blue-800 text-white px-2 py-1 rounded'
                onClick={handleJoin}
            >
                join
            </button>
        </div>
    )
}

