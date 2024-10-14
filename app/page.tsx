import BulbsChooser from "@/components/BulbsChooser";
import { getMqttClient } from "@/lib/mqttClient";
import { getSocketIOServer } from "@/lib/serverside-socket";

export default async function Home() {
  const mqttClient = await getMqttClient();
  getSocketIOServer()

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Bulbs simulator</h1>
      {mqttClient && mqttClient.connected ? (
        <BulbsChooser />
      ) : (
        <p>MQTT broker offline. Reload the page to retry...</p>
      )}
    </div>
  );
}
