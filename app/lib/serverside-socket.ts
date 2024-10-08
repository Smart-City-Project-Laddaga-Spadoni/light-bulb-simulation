import { DefaultEventsMap, Server, ServerOptions } from "socket.io";

let io: Server<DefaultEventsMap, DefaultEventsMap>;

export const initSocketIOServer = (server: Partial<ServerOptions>) => {
  if (!io) {
    io = new Server(server);

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });

      socket.on("bulb:state", ({ bulbName, newState }) => {
        console.log(`The ${bulbName} is now ${newState === 1 ? "on" : "off"}`);
        // publish with mqtt
      });

      socket.on("bulb:brightness", ({ bulbName, newBrightness }) => {
        console.log(
          `The ${bulbName} has changed the brightness to value ${newBrightness}`,
        );
        // publish with mqtt
      });
    });
  }
  return io;
};

export const getSocketIOServerInstance = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
