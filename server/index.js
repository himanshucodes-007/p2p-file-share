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

      socket.send(
        JSON.stringify({
          type: "room-created",
          roomId,
        }),
      );

      rooms[roomId] = {
        host: socket,
      };

      socket.roomId = roomId;
      socket.role = "host";

      console.log(rooms);
    } else if (data.type === "join-room") {
      const room = rooms[data.roomId];

      if (!room) {
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Room not found",
          }),
        );

        return;
      }

      if (room.peer) {
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Room is full",
          }),
        );

        return;
      }

      room.peer = socket;
      socket.roomId = data.roomId;
      socket.role = "peer";

      room.host.send(
        JSON.stringify({
          type: "peer-joined",
          message: "A peer has joined your room",
        }),
      );

      socket.send(
        JSON.stringify({
          type: "joined-room",
          roomId: data.roomId,
          message: "You have joined the room",
        }),
      );

      console.log(rooms);
    } else if (data.type === "signal") {
      const room = rooms[socket.roomId];

      if (!room) {
        console.log("Room not found for signal");
        return;
      }

      let target;

      if (socket.role === "host") {
        target = room.peer;
      } else {
        target = room.host;
      }

      if (target) {
        console.log("Forwarding signal:", data.signal.type);

        target.send(
          JSON.stringify({
            type: "signal",
            signal: data.signal,
          }),
        );
      } else {
        console.log("No target available for signal:", data.signal.type);
      }
    }


  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});
