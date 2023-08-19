import {
  MembersUpdatedEvent,
  RoomCreatedEvent,
  RoomJoinedEvent,
  User,
} from "../types";
import { addUser, getRoomMembers, getUser, removeUser } from "./users";

import { Socket } from "socket.io";

const DefaultColor: string = "#333333";

export function createRoom(socket: Socket, roomId: string, username: string) {
  console.debug(`socket.join:${roomId}`);
  socket.join(roomId);

  const user: User = {
    id: socket?.id,
    username,
    roomId,
    color: DefaultColor,
  };

  const response = addUser(user);
  console.debug(`users:${response}`);

  const roomCreatedEvent: RoomCreatedEvent = { roomId, user };
  console.debug(roomCreatedEvent);

  socket.emit("room-created", roomCreatedEvent);
}

export function joinRoom(socket: Socket, roomId: string, username: string) {
  socket.join(roomId);

  const user: User = {
    id: socket?.id,
    username,
    roomId,
    color: DefaultColor,
  };

  const response = addUser(user);
  console.debug(`users:${response}`);
  const members = getRoomMembers(roomId);
  console.debug(`members:${members}`);

  const roomJoinedEvent: RoomJoinedEvent = { roomId, user, members };
  const membersUpdatedEvent: MembersUpdatedEvent = { members };
  console.debug(roomJoinedEvent);
  console.debug(membersUpdatedEvent);

  socket.emit("room-joined", roomJoinedEvent);
  socket.to(roomId).emit("members-updated", membersUpdatedEvent);
}

export function leaveRoom(socket: Socket) {
  const user = getUser(socket?.id);
  if (!user) return;

  removeUser(socket?.id);
  const members = getRoomMembers(user?.roomId);

  const membersUpdatedEvent: MembersUpdatedEvent = { members };
  console.debug(membersUpdatedEvent);

  socket.to(user?.roomId).emit("members-updated", membersUpdatedEvent);
  socket.leave(user?.roomId);
  console.debug(`leave:${user?.roomId}`);
}
