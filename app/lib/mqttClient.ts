import mqtt, { MqttClient } from "mqtt";
import { sio } from "@/lib/serverside-socket";

let client: MqttClient | null = null;

export const getMqttClient = async () => {
  if (!client) {
    try {
      console.log("Connecting to MQTT broker...");
      client = await mqtt.connectAsync(process.env.MQTT_BROKER_URL!);
    } catch (error) {
      console.error("MQTT connection error:", error);
      client?.end();
      return undefined;
    }

    client.subscribe("device/+", (err) => {
      if (err) {
        console.error("Error subscribing to topic:", err);
      }
      console.log("Subscribed to devices");
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    client.on("error", (error) => {
      console.error("MQTT connection error:", error);
      client?.end();
      client = null;
    });

    // messages sent from the MQTT broker to the next.js server
    client.on("message", (topic, newState) => {
      console.log(
        `Received message from topic: ${topic}, message: ${newState.toString()}`,
      );
      const newS = JSON.parse(newState.toString());
      const device_id = topic.split("/")[1];
      // forward the message to the Bulb component associated with the device_id
      sio.to(device_id).emit("syncState", newS);
    });
  }
  return client;
};
