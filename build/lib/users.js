"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.addUser = exports.getRoomMembers = exports.getUser = void 0;
let users = [];
const getUser = (userId) => {
    return users.find((user) => user.id === userId);
};
exports.getUser = getUser;
const getRoomMembers = (roomId) => {
    return users.filter((user) => user.roomId === roomId);
};
exports.getRoomMembers = getRoomMembers;
const addUser = (user) => {
    return users.push(user);
};
exports.addUser = addUser;
const removeUser = (userId) => {
    users = users.filter((user) => user.id !== userId);
};
exports.removeUser = removeUser;
