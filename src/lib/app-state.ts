import {
  AppStateRequestedEvent,
  Message,
  PrepareAppStateEvent,
  User,
} from "../types";
import { getAdminUser, getRoomMember, getRoomMembers } from "./users";

import { Socket } from "socket.io";

export function prepareAppState(
  socket: Socket,
  roomId: string,
  userId: string
) {
  const adminUser = getAdminUser(roomId);

  // Return if we can't find the client
  if (!adminUser) return;

  const prepareAppStateEvent: PrepareAppStateEvent = {
    roomId,
    userId,
  };
  console.debug(prepareAppStateEvent);

  socket.to(adminUser.id).emit("prepare-app-state", prepareAppStateEvent);
}

export function deliverRequestedAppState(
  socket: Socket,
  roomId: string,
  userId: string,
  members: User[],
  messages: Message[]
) {
  const user = getRoomMember(roomId, userId);

  // Return if we can't find the client
  if (!user) return;

  const event: AppStateRequestedEvent = {
    roomId,
    members,
    messages,
  };
  console.debug(event);

  socket.to(user.id).emit("app-state-requested", event);
}
