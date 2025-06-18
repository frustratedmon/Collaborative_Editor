const WebSocket = require('ws');

// Create a WebSocket Server on port 8080
const wss = new WebSocket.Server({ port: 9090 });

// Placeholder document (for example purposes)
let document = {};

// Handle client connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send the current document state to the new client
    ws.send(JSON.stringify({ type: 'init', data: document }));

    // Handle messages from clients
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'update') {
                document = parsedMessage.data;
                // Broadcast the update to all connected clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'update', data: document }));
                    }
                });
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:8080');
