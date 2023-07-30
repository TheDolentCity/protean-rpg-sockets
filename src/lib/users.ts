import type { User, UserUpdatedEvent } from "../types";

import { Socket } from "socket.io";

let users: User[] = [];

const getUser = (userId: string) => {
  return users.find((user) => user.id === userId);
};

const getRoomMembers = (roomId: string) => {
  return users.filter((user) => user.roomId === roomId);
};

const addUser = (user: User) => {
  return users.push(user);
};

const removeUser = (userId: string) => {
  users = users.filter((user) => user.id !== userId);
};

const updateUser = (
  socket: Socket,
  roomId: string,
  userId: string,
  username: string,
  color: string
) => {
  const found = getUser(userId);
  if (found) {
    found.username = username;
    found.color = color;

    const userUpdatedEvent: UserUpdatedEvent = {
      id: userId,
      roomId,
      username,
      color,
    };
    console.debug(userUpdatedEvent);

    socket.to(roomId).emit("user-updated", userUpdatedEvent);
  }
};

export { getUser, getRoomMembers, addUser, removeUser, updateUser };
