import cors from "cors";
import express from "express";
import http from "http";
import { Server, type Socket } from "socket.io";
import {
  CreateMessageEvent,
  CreateRoomEvent,
  JoinRoomEvent,
  RoomNotFoundEvent,
  UpdateUserEvent,
} from "./types";
import {
  validCreateMessage,
  validCreateRoom,
  validJoinRoom,
  validUpdateUser,
} from "./lib/validation/processors";
import { createRoom, joinRoom, leaveRoom } from "./lib/rooms";
import { createMessage } from "./lib/messages";
import { updateUser } from "./lib/users";

// Initialize Server
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

// Function Definitions
function roomIsCreated(roomId: string): boolean {
  const rooms = [...io.sockets.adapter.rooms];
  return rooms?.some((room) => room[0] === roomId);
}

// Configure Webhooks
io.on("connection", (socket) => {
  console.debug(`connected:${socket.id}`);
  socket.on("create-room", (event: CreateRoomEvent) => {
    console.debug(event);
    if (!validCreateRoom(socket, event)) return;

    console.debug("createRoom");
    createRoom(socket, event.roomId, event.username);
  });

  socket.on("join-room", (event: JoinRoomEvent) => {
    console.debug(event);
    if (!validJoinRoom(socket, event)) return;

    if (roomIsCreated(event.roomId)) {
      console.debug("joinRoom");
      return joinRoom(socket, event.roomId, event.username);
    }

    const roomNotFoundEvent: RoomNotFoundEvent = {
      message: `Oops! Room (${event?.roomId}) doesn't exist or hasn't been created yet.`,
      roomId: event.roomId,
    };

    console.debug(roomNotFoundEvent);
    socket.emit("room-not-found", roomNotFoundEvent);
  });

  socket.on("leave-room", () => {
    console.debug(`leave-room:${socket.id}`);
    leaveRoom(socket);
  });

  socket.on("disconnect", () => {
    console.debug(`disconnected:${socket.id}`);
    socket.emit("disconnected");
    leaveRoom(socket);
  });

  // socket.on('client-ready', (roomId: string) => {
  //   const members = getRoomMembers(roomId);
  //   const adminMember = members[0];

  //   if (!adminMember) return;

  //   socket.to(adminMember.id).emit('get-protean-state');
  // })

  // socket.on(
  //   'send-protean-state',
  //   ({ proteanState, roomId }: { proteanState: string; roomId: string }) => {
  //     const members = getRoomMembers(roomId)
  //     const lastMember = members[members.length - 1]

  //     if (!lastMember) return

  //     socket.to(lastMember.id).emit('protean-state-from-server', proteanState)
  //   }
  // )

  socket.on("update-user", (event: UpdateUserEvent) => {
    console.debug(event);
    if (!validUpdateUser(socket, event)) return;

    updateUser(socket, event.roomId, event.id, event.username, event.color);
  });

  socket.on("create-message", (event: CreateMessageEvent) => {
    console.debug(event);
    if (!validCreateMessage(socket, event)) return;

    createMessage(socket, event.roomId, event.message);
  });
});

// Listen to requests
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
