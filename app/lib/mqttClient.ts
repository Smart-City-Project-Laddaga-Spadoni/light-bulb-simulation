import mqtt, { MqttClient } from "mqtt";
import { getSocketIOServerInstance } from "@/lib/serverside-socket";

let client: MqttClient | null = null;

export const getMqttClient = async () => {
  if (!client) {
    try {
      client = await mqtt.connectAsync(process.env.MQTT_BROKER_URL!);
    } catch (error) {
      console.error("MQTT connection error:", error);
      client?.end();
      return undefined;
    }

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client?.subscribe("device/+", (err) => {
        if (err) {
          console.error("Error subscribing to topic:", err);
        } else {
          const io = getSocketIOServerInstance();
          if (io)
            io.emit("mqtt:connected", { message: "Connected to MQTT broker" });
        }
      });
    });

    client.on("error", (error) => {
      console.error("MQTT connection error:", error);
      client?.end();
      client = null;
    });

    client.on("message", (topic, message) => {
      console.log(
        `Received message from topic: ${topic}, message: ${message.toString()}`,
      );
      if (topic.startsWith("device/")) {
        // handle bulb state change
      }
    });
  }
  return client;
};
