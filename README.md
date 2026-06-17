# P2P File Sharing App 🚀

A peer-to-peer file sharing application built using **WebRTC**, **WebSockets**, and **React**. Files are transferred directly between devices without being stored on any server.

## 📌 Project Overview

Traditional file sharing services require files to be uploaded to a server before being downloaded by another user. This project eliminates that middleman by establishing a direct peer-to-peer connection between users.

The signaling server is only responsible for helping peers discover each other and exchange WebRTC connection information. Actual file transfers occur directly between devices.

## 🏗️ Architecture

```text
Friend A (Browser)          Signaling Server            Friend B (Browser)
       |                         (WebSocket)                    |
       |---------------- Connect ------------------------------>|
       |                                                        |
       |------ Create Room ------------------------------------>|
       |                                                        |
       |<----- Peer Joined -------------------------------------|
       |                                                        |
       |=== WebRTC Signaling (Offer/Answer/ICE) ==============>|
       |                                                        |
       |<========== Direct P2P Connection =====================>|
       |                                                        |
       |<========== Direct File Transfer ======================>|
```

## 🛠️ Tech Stack

### Backend

* Node.js
* WebSocket (`ws`)

### Frontend (Upcoming)

* React
* Vite
* Tailwind CSS

### Peer-to-Peer Communication (Upcoming)

* WebRTC
* simple-peer

### Deployment (Planned)

* Render (Signaling Server)
* Vercel (Frontend)

---

# 📂 Project Structure

```text
p2p-file-share/
│
├── server/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── client/          (Upcoming)
│
└── README.md
```

---

# ✅ Progress

## Day 1 — Architecture & Planning

### Concepts Learned

* Peer-to-Peer Communication
* WebSocket
* WebRTC
* Signaling Server
* Offer / Answer Flow
* ICE Candidates

### Outcome

Designed the complete system architecture and understood how browsers establish direct communication using WebRTC.

---

## Day 2 — WebSocket Signaling Server

### Features Implemented

* WebSocket Server Setup
* Client Connection Handling
* JSON Message Parsing
* Room Creation
* Room Joining
* Room Validation

### Message Types

#### Create Room

```json
{
  "type": "create-room"
}
```

#### Join Room

```json
{
  "type": "join-room",
  "roomId": "ABC123"
}
```

### Outcome

Users can:

* Create a room
* Join a room
* Receive room-related notifications

---

## Day 3 — Signaling Relay System

### Features Implemented

* Host and Peer Role Assignment
* Room-Based Message Routing
* Signal Forwarding
* Room Capacity Validation

### Signal Flow

```text
Host
  |
  | signal
  v
Server
  |
  | signal
  v
Peer
```

### Message Example

```json
{
  "type": "signal",
  "signal": {
    "test": "hello from host"
  }
}
```

### Outcome

Successfully implemented bidirectional signaling:

```text
Host -> Server -> Peer
Peer -> Server -> Host
```

This signaling layer will be used by WebRTC to exchange Offers, Answers, and ICE Candidates.

---

# 🚧 Upcoming Features

## Day 4

* WebRTC Integration
* simple-peer Setup
* Browser-to-Browser Connection

## Day 5

* Data Channel Communication
* Direct Message Exchange

## Day 6

* File Transfer Functionality

## Day 7

* Chunked File Transfer
* Progress Tracking

## Day 8

* React UI Development

## Day 9

* QR Code Room Sharing
* Error Handling Improvements

## Day 10

* Deployment
* Final Testing
* Documentation

---

# 🎯 Learning Goals

This project is being built to gain hands-on experience with:

* Real-Time Communication
* WebSockets
* WebRTC
* Peer-to-Peer Networking
* System Design
* Full Stack Development
* File Streaming

---

# 📜 Current Status

✅ Day 1 Completed

✅ Day 2 Completed

✅ Day 3 Completed

🚀 Day 4 Next: Establishing a Real WebRTC Connection
