"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = void 0;
function createMessage(socket, roomId, message) {
    const messageCreatedEvent = { roomId, message };
    console.debug(messageCreatedEvent);
    socket.emit("message-created", messageCreatedEvent);
    socket.to(roomId).emit("message-created", messageCreatedEvent);
}
exports.createMessage = createMessage;
