import { createServer } from "http";
import { Server } from "socket.io";
import { getMqttClient } from "@/lib/mqttClient";

type MessageData = {
  is_on: boolean;
  brightness: number;
};

type DeviceData = {
  device_id: string;
  status: MessageData;
};

const httpServer = createServer();
export const sio = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

sio.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("join", async (device_id) => {
    console.log(`User with id ${socket.id} joined room ${device_id}`);
    socket.join(device_id);
    // sign the bulb in to the python iot server
    const client = await getMqttClient();
    if (client) {
      if (client.connected) {
        client.publish(`device/signin`, JSON.stringify({ device_id }));
        console.log(`Published signin message for ${device_id}`);
      } else {
        console.error("MQTT client is not connected");
      }
    } else {
      console.error("MQTT client could not be retrieved");
    }
  });

  // messages sent from Bulb components to the next.js server
  socket.on("publishState", async ({ device_id, status }: DeviceData) => {
    console.log(
      `${device_id} changed the bulb state to\n${JSON.stringify({ device_id, status })}`,
    );

    // forward the message to the MQTT broker
    const client = await getMqttClient();
    if (client) {
      if (client.connected) {
        client.publish(
          `device/${device_id}/stateChange`,
          JSON.stringify(status)
        );
        console.log(`Published state change to device/${device_id}`);
      } else {
        console.error("MQTT client is not connected");
      }
    } else {
      console.error("MQTT client could not be retrieved");
    }
  });
});

httpServer.listen(process.env.SOCKET_IO_SERVER_PORT);
