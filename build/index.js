"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const processors_1 = require("./lib/validation/processors");
const rooms_1 = require("./lib/rooms");
const messages_1 = require("./lib/messages");
// Initialize Server
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
// Function Definitions
function roomIsCreated(roomId) {
    const rooms = [...io.sockets.adapter.rooms];
    return rooms === null || rooms === void 0 ? void 0 : rooms.some((room) => room[0] === roomId);
}
// Configure Webhooks
io.on("connection", (socket) => {
    console.debug(`connected:${socket.id}`);
    socket.on("create-room", (event) => {
        console.debug(event);
        if (!(0, processors_1.validCreateRoom)(socket, event))
            return;
        console.debug("createRoom");
        (0, rooms_1.createRoom)(socket, event.roomId, event.username);
    });
    socket.on("join-room", (event) => {
        console.debug(event);
        if (!(0, processors_1.validJoinRoom)(socket, event))
            return;
        if (roomIsCreated(event.roomId)) {
            console.debug("joinRoom");
            return (0, rooms_1.joinRoom)(socket, event.roomId, event.username);
        }
        const roomNotFoundEvent = {
            message: `Oops! Room (${event === null || event === void 0 ? void 0 : event.roomId}) doesn't exist or hasn't been created yet.`,
            roomId: event.roomId,
        };
        console.debug(roomNotFoundEvent);
        socket.emit("room-not-found", roomNotFoundEvent);
    });
    socket.on("leave-room", () => {
        console.debug(`leave-room:${socket.id}`);
        (0, rooms_1.leaveRoom)(socket);
    });
    socket.on("disconnect", () => {
        console.debug(`disconnected:${socket.id}`);
        socket.emit("disconnected");
        (0, rooms_1.leaveRoom)(socket);
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
    socket.on("create-message", (event) => {
        console.debug(event);
        if (!(0, processors_1.validCreateMessage)(socket, event))
            return;
        (0, messages_1.createMessage)(socket, event.roomId, event.message);
    });
});
// Listen to requests
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
