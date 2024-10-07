import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

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

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
