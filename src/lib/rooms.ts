import { Socket } from "socket.io";
import { RoomJoinedEvent, UpdateMembersEvent, User } from "../types";
import { addUser, getRoomMembers, getUser, removeUser } from "./users";

export function joinRoom(socket: Socket, roomId: string, username: string) {
  socket.join(roomId);

  const user: User = {
    id: socket?.id,
    username,
    roomId,
  };

  addUser(user);
  const members = getRoomMembers(roomId);

  const roomJoinedEvent: RoomJoinedEvent = { roomId, user, members };
  const updateMembersEvent: UpdateMembersEvent = { members };

  socket.emit("room-joined", roomJoinedEvent);
  socket.to(roomId).emit("update-members", updateMembersEvent);
}

export function leaveRoom(socket: Socket) {
  const user = getUser(socket?.id);
  if (!user) return;

  removeUser(socket?.id);
  const members = getRoomMembers(user?.roomId);

  const updateMembersEvent: UpdateMembersEvent = { members };

  socket.to(user?.roomId).emit("update-members", updateMembersEvent);
  socket.leave(user?.roomId);
}
