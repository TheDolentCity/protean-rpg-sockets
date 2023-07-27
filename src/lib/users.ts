import type { User } from "../types";

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

export { getUser, getRoomMembers, addUser, removeUser };
