"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = exports.createRoom = void 0;
const users_1 = require("./users");
function createRoom(socket, roomId, username) {
    console.debug(`socket.join:${roomId}`);
    socket.join(roomId);
    const user = {
        id: socket === null || socket === void 0 ? void 0 : socket.id,
        username,
        roomId,
    };
    const response = (0, users_1.addUser)(user);
    console.debug(`users:${response}`);
    const roomCreatedEvent = { roomId, user };
    console.debug(roomCreatedEvent);
    socket.emit("room-created", roomCreatedEvent);
}
exports.createRoom = createRoom;
function joinRoom(socket, roomId, username) {
    socket.join(roomId);
    const user = {
        id: socket === null || socket === void 0 ? void 0 : socket.id,
        username,
        roomId,
    };
    const response = (0, users_1.addUser)(user);
    console.debug(`users:${response}`);
    const members = (0, users_1.getRoomMembers)(roomId);
    console.debug(`members:${members}`);
    const roomJoinedEvent = { roomId, user, members };
    const updateMembersEvent = { members };
    console.debug(roomJoinedEvent);
    console.debug(updateMembersEvent);
    socket.emit("room-joined", roomJoinedEvent);
    socket.to(roomId).emit("update-members", updateMembersEvent);
}
exports.joinRoom = joinRoom;
function leaveRoom(socket) {
    const user = (0, users_1.getUser)(socket === null || socket === void 0 ? void 0 : socket.id);
    if (!user)
        return;
    (0, users_1.removeUser)(socket === null || socket === void 0 ? void 0 : socket.id);
    const members = (0, users_1.getRoomMembers)(user === null || user === void 0 ? void 0 : user.roomId);
    const updateMembersEvent = { members };
    console.debug(updateMembersEvent);
    socket.to(user === null || user === void 0 ? void 0 : user.roomId).emit("update-members", updateMembersEvent);
    socket.leave(user === null || user === void 0 ? void 0 : user.roomId);
    console.debug(`leave:${user === null || user === void 0 ? void 0 : user.roomId}`);
}
exports.leaveRoom = leaveRoom;
