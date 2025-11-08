import app from "@/index";

interface WebsocketType {
    type: "text" | "join"
    message: string
    username: string
}

const clients = new Set<Bun.ServerWebSocket<WebsocketType>>();

const serve = Bun.serve<WebsocketType>({
    port: 3000,
    routes: {
        "/api/status": new Response("OK")
    },
    fetch(req, server) {
        const url = new URL(req.url);
        if (url.pathname === "/chat") {
            const success = server.upgrade(req, {
                data: {} as WebsocketType
            })
            return success ? undefined : new Response("Failed to upgrade to WebSocket", { status: 400 });
        }
        return app.fetch(req);
    },
    websocket: {
        open(ws) {
            ws.subscribe("group-chat");
            clients.add(ws);
        }, // a socket is opened
        message(ws, raw) {
            try {
                const text = typeof raw === "string" ? raw : raw.toString();
                const data = JSON.parse(text) as WebsocketType;

                if (data.type === "join") {
                    ws.data = data;
                    ws.publish("group-chat", JSON.stringify({
                        type: "system",
                        message: `${data.username} has joined the chat.`,
                        username: "system"
                    }))
                } else if (data.type === "text") {
                    ws.publish("group-chat", JSON.stringify({
                        type: "text",
                        message: data.message,
                        username: data.username
                    }))
                }
            } catch (err) {
                console.log("Failed to parse message:", err);
            }
        }, // a message is received
        close(ws, code, message) {
            ws.unsubscribe("group-chat");
            clients.delete(ws);
        }, // a socket is closed
    }
})

console.log(`Server running at http://localhost:${serve.port}/`);

