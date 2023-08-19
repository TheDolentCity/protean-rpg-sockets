import {
  AppStatePreparedEvent,
  CreateMessageEvent,
  CreateRoomEvent,
  InvalidDataEvent,
  JoinRoomEvent,
  RequestAppStateEvent,
  UpdateUserEvent,
} from "../../types";
import {
  AppStatePreparedSchema,
  CreateMessageSchema,
  CreateRoomSchema,
  JoinRoomSchema,
  RequestAppStateSchema,
  UpdateUserSchema,
} from "./schemas";

import { Socket } from "socket.io";
import { ValiError } from "valibot";

/**
 * -----------------------------------------------------------------------
 * Room Processors -------------------------------------------------------
 * -----------------------------------------------------------------------
 */
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

/**
 * -----------------------------------------------------------------------
 * App State Processors --------------------------------------------------
 * -----------------------------------------------------------------------
 */
export function validRequestAppState(
  socket: Socket,
  event: RequestAppStateEvent
) {
  try {
    return RequestAppStateSchema.parse(event);
  } catch (error) {
    if (error instanceof ValiError) {
      console.debug(error);
      const invalidDataEvent: InvalidDataEvent = {
        message: "Failed to request app state. Invalid data.",
      };
      socket.emit("invalid-data", invalidDataEvent);
    }
  }
}

export function validAppStatePrepared(
  socket: Socket,
  event: AppStatePreparedEvent
) {
  try {
    return AppStatePreparedSchema.parse(event);
  } catch (error) {
    if (error instanceof ValiError) {
      console.debug(error);
      const invalidDataEvent: InvalidDataEvent = {
        message: "Failed app state prepared. Invalid data.",
      };
      socket.emit("invalid-data", invalidDataEvent);
    }
  }
}

/**
 * -----------------------------------------------------------------------
 * User Processors -------------------------------------------------------
 * -----------------------------------------------------------------------
 */
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

/**
 * -----------------------------------------------------------------------
 * Message Processors ----------------------------------------------------
 * -----------------------------------------------------------------------
 */
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
