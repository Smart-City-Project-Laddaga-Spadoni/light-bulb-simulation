"use strict"
import mqtt, { IClientOptions, MqttClient } from "mqtt";
import { getSocketIOServer } from "@/lib/serverside-socket";
import path from "node:path";
import fs from "fs";

let client: MqttClient | null = null;

export const getMqttClient = async () => {
  if (!client) {
    try {
      const KEY = fs.readFileSync(
        path.join(__dirname, "..","..", "..", "public", "mqttCerts", "MyIoTDevice.private.key"),
      );
      const CERT = fs.readFileSync(
        path.join(__dirname, "..","..", "..", "public", "mqttCerts", "MyIoTDevice.cert.pem"),
      );

      const connOpts = {
        port: 8883,
        host: process.env.MQTT_BROKER_URL,
        key: KEY,
        cert: CERT,
        rejectUnauthorized: true,
        protocol: "mqtts",
      } as IClientOptions;

      console.log("Connecting to AWS IoT Core...");
      client = await mqtt.connectAsync(connOpts);
    } catch (error) {
      console.error("MQTT connection error:", error);
      client?.end();
      return undefined;
    }

    client.subscribe("device/+/stateChange", (err) => {
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
      if (topic.endsWith("stateChange")) {
        const newS = JSON.parse(newState.toString());
        const device_id = topic.split("/")[1];
        // forward the message to the Bulb component associated with the device_id
        const sio = getSocketIOServer();
        sio.to(device_id).emit("syncState", newS);
      }
    });
  }
  return client;
};
