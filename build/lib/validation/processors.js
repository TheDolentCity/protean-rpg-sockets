"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validCreateMessage = exports.validJoinRoom = exports.validCreateRoom = void 0;
const schemas_1 = require("./schemas");
const valibot_1 = require("valibot");
function validCreateRoom(socket, event) {
    try {
        return schemas_1.CreateRoomSchema.parse(event);
    }
    catch (error) {
        if (error instanceof valibot_1.ValiError) {
            console.debug(error);
            const invalidDataEvent = {
                message: "Failed to create and join room. Invalid data.",
            };
            socket.emit("invalid-data", invalidDataEvent);
        }
    }
}
exports.validCreateRoom = validCreateRoom;
function validJoinRoom(socket, event) {
    try {
        return schemas_1.JoinRoomSchema.parse(event);
    }
    catch (error) {
        if (error instanceof valibot_1.ValiError) {
            console.debug(error);
            const invalidDataEvent = {
                message: "Failed to join room. Invalid data.",
            };
            socket.emit("invalid-data", invalidDataEvent);
        }
    }
}
exports.validJoinRoom = validJoinRoom;
function validCreateMessage(socket, event) {
    try {
        return schemas_1.CreateMessageSchema.parse(event);
    }
    catch (error) {
        if (error instanceof valibot_1.ValiError) {
            console.debug(error);
            const invalidDataEvent = {
                message: "Failed to create message. Invalid data.",
            };
            socket.emit("invalid-data", invalidDataEvent);
        }
    }
}
exports.validCreateMessage = validCreateMessage;
