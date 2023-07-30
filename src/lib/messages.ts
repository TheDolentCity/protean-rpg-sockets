import { Message, MessageCreatedEvent } from "../types";

import { Socket } from "socket.io";

export function createMessage(
  socket: Socket,
  roomId: string,
  message: Message
) {
  const messageCreatedEvent: MessageCreatedEvent = { roomId, message };
  console.debug(messageCreatedEvent);

  socket.emit("message-created", messageCreatedEvent);
  socket.to(roomId).emit("message-created", messageCreatedEvent);
}
