import { createServer } from "http";
import { Server } from "socket.io";
import { getMqttClient } from "@/lib/mqttClient";
import { DeviceData, MessageData } from "@/lib/types";

let sio: Server | null = null;

export const getSocketIOServer = () => {
  if (!sio) {
    const httpServer = createServer();
    sio = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    sio.on("connection", (socket) => {
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });

      socket.on(
        "join",
        async (device_id: string, initialStatus: MessageData) => {
          console.log(
            `User with id ${socket.id} joined room ${device_id} with initial status ${JSON.stringify(initialStatus)}`,
          );
          socket.join(device_id);
          // sign the bulb in to the python iot server
          const client = await getMqttClient();
          if (client) {
            if (client.connected) {
              client.publish(
                `device/${device_id}/signin`,
                JSON.stringify({ status: initialStatus }),
              );
              console.log(
                `Published signin message for ${device_id} with status ${JSON.stringify({ status: initialStatus })}`,
              );
            } else {
              console.error("MQTT client is not connected");
            }
          } else {
            console.error("MQTT client could not be retrieved");
          }
        },
      );

      // messages sent from Bulb components to the next.js server
      socket.on("publishState", async ({ device_id, status }: DeviceData) => {
        console.log(
          `${device_id} changed the bulb state to\n${JSON.stringify({ status })}`,
        );

        // forward the message to the MQTT broker
        const client = await getMqttClient();
        if (client) {
          if (client.connected) {
            client.publish(
              `device/${device_id}/stateChange`,
              JSON.stringify({ status }),
            );
            console.log(
              `Published ${JSON.stringify({ status })} change to device/${device_id}`,
            );
          } else {
            console.error("MQTT client is not connected");
          }
        } else {
          console.error("MQTT client could not be retrieved");
        }
      });
    });

    httpServer.listen(process.env.SOCKET_IO_SERVER_PORT);
  }
  return sio;
};
