import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { IoLogoWechat, IoSend } from "react-icons/io5";

interface Message {
    id: string;
    message: string;
    sender: string;
    timestamp: Date;
}

interface ChatRoomProps {
    roomId: string;
    onLeaveRoom: () => void;
}

const ChatRoom = ({ roomId, onLeaveRoom }: ChatRoomProps) => {
    const { user } = useAuth0();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8082');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                payload: { roomId }
            }));
        };

        ws.onmessage = (event) => {
            const parsedMessage = JSON.parse(event.data);
            if (parsedMessage.type === "chat") {
                const newMessage: Message = {
                    id: `${Date.now()}-${Math.random()}`,
                    message: parsedMessage.payload.message,
                    sender: parsedMessage.payload.sender || 'Anonymous',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, newMessage]);
            }
        };

        wsRef.current = ws;
        return () => ws.close();
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (inputMessage.trim() && wsRef.current) {
            const currentUser = user?.name || user?.email || 'You';
            wsRef.current.send(JSON.stringify({
                type: "chat",
                payload: {
                    message: inputMessage,
                    sender: currentUser
                }
            }));
            setInputMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="bg-black p-4 flex items-center justify-between border-b border-white/20">
                <div className="flex items-center space-x-3">
                    <IoLogoWechat className="text-3xl text-white" />
                    <div>
                        <h1 className="text-xl font-bold text-white">ChatRoom</h1>
                        <p className="text-sm text-gray-300">Room: {roomId}</p>
                    </div>
                </div>
                <button
                    onClick={onLeaveRoom}
                    className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors font-semibold"
                >
                    Leave Room
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg wrap-break-word bg-gray-800 text-white border border-white/20">
                                <p className="text-xs text-gray-400 mb-1 font-semibold">{message.sender}</p>
                                <p>{message.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black border-t border-white/20">
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-gray-400"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim()}
                        className="p-3 bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                        <IoSend className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;