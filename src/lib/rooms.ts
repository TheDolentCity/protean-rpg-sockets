import { Socket } from "socket.io";
import {
  RoomCreatedEvent,
  RoomJoinedEvent,
  UpdateMembersEvent,
  User,
} from "../types";
import { addUser, getRoomMembers, getUser, removeUser } from "./users";

export function createRoom(socket: Socket, roomId: string, username: string) {
  console.debug(`socket.join:${roomId}`);
  socket.join(roomId);

  const user: User = {
    id: socket?.id,
    username,
    roomId,
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
  };

  const response = addUser(user);
  console.debug(`users:${response}`);
  const members = getRoomMembers(roomId);
  console.debug(`members:${members}`);

  const roomJoinedEvent: RoomJoinedEvent = { roomId, user, members };
  const updateMembersEvent: UpdateMembersEvent = { members };
  console.debug(roomJoinedEvent);
  console.debug(updateMembersEvent);

  socket.emit("room-joined", roomJoinedEvent);
  socket.to(roomId).emit("update-members", updateMembersEvent);
}

export function leaveRoom(socket: Socket) {
  const user = getUser(socket?.id);
  if (!user) return;

  removeUser(socket?.id);
  const members = getRoomMembers(user?.roomId);

  const updateMembersEvent: UpdateMembersEvent = { members };
  console.debug(updateMembersEvent);

  socket.to(user?.roomId).emit("update-members", updateMembersEvent);
  socket.leave(user?.roomId);
  console.debug(`leave:${user?.roomId}`);
}
