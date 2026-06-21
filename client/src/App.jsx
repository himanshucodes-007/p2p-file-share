import { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import "./test";

function App() {
  const [roomId, setRoomId] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [role, setRole] = useState(null);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef(null);
  // const peerRef = useRef(null);

  // const initializePeer = (initiator) => {
  //   const peer = new Peer({
  //     initiator,
  //     trickle: false,
  //   });

  //   peerRef.current = peer;

  //   peer.on("signal", (data) => {
  //     console.log("Generated Signal:", data);

  //     wsRef.current.send(
  //       JSON.stringify({
  //         type: "signal",
  //         signal: data,
  //       }),
  //     );
  //   });

  //   peer.on("connect", () => {
  //     console.log("WEBRTC CONNECTED");
  //     setConnected(true);

  //     if (initiator) {
  //       peer.send("Hello Peer!");
  //     }
  //   });

  //   peer.on("data", (data) => {
  //     console.log("Received:", data.toString());
  //   });

  //   peer.on("error", (err) => {
  //     console.error("PEER ERROR:", err);
  //   });
  // };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to signaling server");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Received:", data);

      if (data.type === "room-created") {
        setCreatedRoomId(data.roomId);
        // initializePeer(true);
      }

      if (data.type === "peer-joined") {
        console.log("A peer joined your room");
      }

      if (data.type === "joined-room") {
        console.log("Successfully joined room");
        // initializePeer(false);
      }

      // if (data.type === "signal") {
      //   if (!peerRef.current) {
      //     console.log("Peer not initialized yet");
      //     return;
      //   }

      //   peerRef.current.signal(data.signal);
      // }

      if (data.type === "error") {
        alert(data.message);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from signaling server");
    };

    return () => {
      ws.close();

      // if (peerRef.current) {
      //   peerRef.current.destroy();
      // }
    };
  }, []);

  const createRoom = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected");
      return;
    }

    setRole("host");

    wsRef.current.send(
      JSON.stringify({
        type: "create-room",
      }),
    );
  };

  const joinRoom = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected");
      return;
    }

    if (!roomId.trim()) {
      alert("Please enter a Room ID");
      return;
    }

    setRole("peer");

    wsRef.current.send(
      JSON.stringify({
        type: "join-room",
        roomId: roomId.trim(),
      }),
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h1>P2P File Sharing</h1>
      <h2>Status: {connected ? "🟢 Connected" : "🟡 Waiting"}</h2>
      {role && <h3>Role: {role}</h3>}
      <button onClick={createRoom}>Create Room</button>
      {createdRoomId && <h3>Room ID: {createdRoomId}</h3>}
      <br />
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
      />
      <button onClick={joinRoom}>Join Room</button>
      
      <button
        onClick={() => {
          const peer = new Peer({
            initiator: true,
            trickle: false,
          });

          peer.on("signal", (data) => {
            console.log("SIGNAL GENERATED:");
            console.log(data);
          });

          peer.on("error", (err) => {
            console.error("PEER ERROR:", err);
          });

          console.log("Peer Created", peer);
        }}
      >
        Test Peer
      </button>
    </div>
  );
}

export default App;
