const WebSocket = require("ws");

const rooms = {};

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server is running on port 8080");

wss.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (message) => {
    const data = JSON.parse(message.toString());

    console.log(data);

    if (data.type === "create-room") {
      const roomId = generateRoomId();
      rooms[roomId] = {
        host: socket,
      };

      socket.send(
        JSON.stringify({
          type: "room-created",
          roomId,
        }),
      );

      console.log(rooms);
    }

    if (data.type === "join-room") {
        const room = rooms[data.roomId];

        if(!room){
            socket.send(JSON.stringify({
                type: "error",
                message: "Room not found"
            }));

            return;
        }

        room.peer = socket;

        room.host.send(JSON.stringify({
            type: "peer-joined",
            message: "A peer has joined your room"
        }));

        socket.send(JSON.stringify({
            type: "joined-room",
            roomId: data.roomId,
            message: "You have joined the room"
        }));

        if(room.peer){
          socket.send(JSON.stringify({
            type: "error",
            message: "Room is full"
          }));

          return;
        }

        console.log(rooms);
    }


  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});
