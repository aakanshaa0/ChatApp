import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8082 });

interface User{
    socket: WebSocket;
    room: string;
}

const rooms = new Set<string>();
let users: User[] = [];

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const data = JSON.parse(message.toString());

        if (data.type === "create") {
            const roomId = data.payload.roomId;
            rooms.add(roomId);
            socket.send(JSON.stringify({ 
                type: "created", 
                payload: { roomId } 
            }));
        }

        if (data.type === "join") {
            const roomId = data.payload.roomId;
            users = users.filter(user => user.socket !== socket);
            users.push({ socket, room: roomId });
        }

        if (data.type === "chat") {
            const userRoom = users.find(user => user.socket === socket)?.room;
            if (userRoom) {
                const messageData = {
                    type: "chat",
                    payload: {
                        message: data.payload.message,
                        sender: data.payload.sender
                    }
                };
                users.forEach(user => {
                    if (user.room === userRoom && user.socket.readyState === WebSocket.OPEN) {
                        user.socket.send(JSON.stringify(messageData));
                    }
                });
            }
        }
    });

    socket.on("close", () => {
        users = users.filter(user => user.socket !== socket);
    });
});

console.log("WebSocket server running on port 8082");