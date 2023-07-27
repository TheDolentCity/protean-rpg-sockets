import { Socket } from "socket.io";
import { CreateRoomEvent, JoinRoomEvent } from "../types";
import { CreateRoomSchema, JoinRoomSchema } from "./validation-schemas";
import { ValiError } from "valibot";

export function invalidCreateRoom(socket: Socket, event: CreateRoomEvent) {
  try {
    return CreateRoomSchema.parse(event);
  } catch (error) {
    if (error instanceof ValiError) {
      socket.emit("invalid-data", {
        message: "Failed to create and join room. Invalid data.",
      });
    }
  }
}

export function invalidJoinRoom(socket: Socket, event: JoinRoomEvent) {
  try {
    return JoinRoomSchema.parse(event);
  } catch (error) {
    if (error instanceof ValiError) {
      socket.emit("invalid-data", {
        message: "Failed to join room. Invalid data.",
      });
    }
  }
}
