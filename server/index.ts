const serve = Bun.serve({
    port: 3000,
    routes: {
        "/api/status": new Response("OK")
    },
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Hello, Bun!");
    },
    websocket: {
        open(ws) {
            ws.send("Client connected");
        }, // a socket is opened
        message(ws, message) {
            ws.send(`Echo: ${message}`);
        }, // a message is received
        close(ws, code, message) { }, // a socket is closed
        drain(ws) { }, // the socket is ready to receive more data
    }
})

console.log(`Server running at http://localhost:${serve.port}/`);

