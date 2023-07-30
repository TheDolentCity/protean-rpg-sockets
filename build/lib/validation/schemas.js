"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessageSchema = exports.JoinRoomSchema = exports.CreateRoomSchema = void 0;
const valibot_1 = require("valibot");
exports.CreateRoomSchema = (0, valibot_1.object)({
    username: (0, valibot_1.string)([
        (0, valibot_1.minLength)(2, "Username must be at least 2 characters"),
        (0, valibot_1.maxLength)(32, "Username cannot be more than 32 characters."),
    ]),
    roomId: (0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.length)(21, "Room ID must be exactly 21 characters."),
    ]),
});
exports.JoinRoomSchema = (0, valibot_1.object)({
    username: (0, valibot_1.string)([
        (0, valibot_1.minLength)(2, "Username must be at least 2 characters"),
        (0, valibot_1.maxLength)(32, "Username cannot be more than 32 characters."),
    ]),
    roomId: (0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.length)(21, "Room ID must be exactly 21 characters."),
    ]),
});
exports.CreateMessageSchema = (0, valibot_1.object)({
    message: (0, valibot_1.object)({
        text: (0, valibot_1.string)([
            (0, valibot_1.minLength)(1, "Text must be at least 1 characters"),
            (0, valibot_1.maxLength)(256, "Text cannot be more than 256 characters."),
        ]),
        createdBy: (0, valibot_1.string)([
            (0, valibot_1.minLength)(2, "Created by must be at least 2 characters"),
            (0, valibot_1.maxLength)(32, "Created by cannot be more than 32 characters."),
        ]),
    }),
});
