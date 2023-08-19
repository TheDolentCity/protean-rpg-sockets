import cors from "cors";
import express from "express";
import http from "http";
import { Server, type Socket } from "socket.io";
import {
  AppStatePreparedEvent,
  CreateMessageEvent,
  CreateRoomEvent,
  JoinRoomEvent,
  RequestAppStateEvent,
  RoomNotFoundEvent,
  UpdateUserEvent,
} from "./types";
import {
  validAppStatePrepared,
  validCreateMessage,
  validCreateRoom,
  validJoinRoom,
  validRequestAppState,
  validUpdateUser,
} from "./lib/validation/processors";
import { createRoom, joinRoom, leaveRoom } from "./lib/rooms";
import { createMessage } from "./lib/messages";
import { updateUser } from "./lib/users";
import { deliverRequestedAppState, prepareAppState } from "./lib/app-state";

/**
 * -----------------------------------------------------------------------
 * Initialize Server -----------------------------------------------------
 * -----------------------------------------------------------------------
 */
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

/**
 * -----------------------------------------------------------------------
 * Function Definitions --------------------------------------------------
 * -----------------------------------------------------------------------
 */
function roomIsCreated(roomId: string): boolean {
  const rooms = [...io.sockets.adapter.rooms];
  return rooms?.some((room) => room[0] === roomId);
}

/**
 * -----------------------------------------------------------------------
 * Configure Server ------------------------------------------------------
 * -----------------------------------------------------------------------
 */
io.on("connection", (socket: Socket) => {
  console.debug(`connected:${socket.id}`);

  /**
   * -----------------------------------------------------------------------
   * Room Events -----------------------------------------------------------
   * -----------------------------------------------------------------------
   */
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

  /**
   * -----------------------------------------------------------------------
   * App State Events ------------------------------------------------------
   * -----------------------------------------------------------------------
   */
  socket.on("request-app-state", (event: RequestAppStateEvent) => {
    console.debug("RequestAppStateEvent");
    console.debug(event);
    if (!validRequestAppState(socket, event)) return;

    prepareAppState(socket, event.roomId, event.userId);
  });

  socket.on("app-state-prepared", (event: AppStatePreparedEvent) => {
    console.debug("AppStatePreparedEvent");
    console.debug(event);
    if (!validAppStatePrepared(socket, event)) return;

    deliverRequestedAppState(
      socket,
      event.roomId,
      event.userId,
      event.members,
      event.messages
    );
  });

  /**
   * -----------------------------------------------------------------------
   * User Events -----------------------------------------------------------
   * -----------------------------------------------------------------------
   */
  socket.on("update-user", (event: UpdateUserEvent) => {
    console.debug(event);
    if (!validUpdateUser(socket, event)) return;

    updateUser(socket, event.roomId, event.id, event.username, event.color);
  });

  /**
   * -----------------------------------------------------------------------
   * Message Events --------------------------------------------------------
   * -----------------------------------------------------------------------
   */
  socket.on("create-message", (event: CreateMessageEvent) => {
    console.debug(event);
    if (!validCreateMessage(socket, event)) return;

    createMessage(socket, event.roomId, event.message);
  });
});

/**
 * -----------------------------------------------------------------------
 * Start Listening -------------------------------------------------------
 * -----------------------------------------------------------------------
 */
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
