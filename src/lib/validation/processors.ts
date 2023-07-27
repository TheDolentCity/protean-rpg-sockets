import { Socket } from "socket.io";
import { CreateRoomEvent, InvalidDataEvent, JoinRoomEvent } from "../../types";
import { CreateRoomSchema, JoinRoomSchema } from "./schemas";
import { ValiError } from "valibot";

export function validCreateRoom(socket: Socket, event: CreateRoomEvent) {
  try {
    return CreateRoomSchema.parse(event);
  } catch (error) {
    if (error instanceof ValiError) {
      console.debug(error);
      const invalidDataEvent: InvalidDataEvent = {
        message: "Failed to create and join room. Invalid data.",
      };
      socket.emit("invalid-data", invalidDataEvent);
    }
  }
}

export function validJoinRoom(socket: Socket, event: JoinRoomEvent) {
  try {
    return JoinRoomSchema.parse(event);
  } catch (error) {
    if (error instanceof ValiError) {
      console.debug(error);
      const invalidDataEvent: InvalidDataEvent = {
        message: "Failed to join room. Invalid data.",
      };
      socket.emit("invalid-data", invalidDataEvent);
    }
  }
}
