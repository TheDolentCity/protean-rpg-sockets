import {
  CreateMessageEvent,
  CreateRoomEvent,
  InvalidDataEvent,
  JoinRoomEvent,
  UpdateUserEvent,
} from "../../types";
import {
  CreateMessageSchema,
  CreateRoomSchema,
  JoinRoomSchema,
  UpdateUserSchema,
} from "./schemas";

import { Socket } from "socket.io";
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

export function validUpdateUser(socket: Socket, event: UpdateUserEvent) {
  try {
    return UpdateUserSchema.parse(event);
  } catch (error) {
    if (error instanceof ValiError) {
      console.debug(error);
      const invalidDataEvent: InvalidDataEvent = {
        message: "Failed to update user. Invalid data.",
      };
      socket.emit("invalid-data", invalidDataEvent);
    }
  }
}

export function validCreateMessage(socket: Socket, event: CreateMessageEvent) {
  try {
    return CreateMessageSchema.parse(event);
  } catch (error) {
    if (error instanceof ValiError) {
      console.debug(error);
      const invalidDataEvent: InvalidDataEvent = {
        message: "Failed to create message. Invalid data.",
      };
      socket.emit("invalid-data", invalidDataEvent);
    }
  }
}
