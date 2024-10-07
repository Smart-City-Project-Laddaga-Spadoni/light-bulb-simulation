import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;

export const getMqttClient = async () => {
  if (!client) {
    try {
      client = await mqtt.connectAsync("mqtt://localhost:1883");
    } catch (error) {
      console.error("MQTT connection error:", error);
      client?.end();
      return undefined;
    }

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
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
    });
  }
  return client;
};
