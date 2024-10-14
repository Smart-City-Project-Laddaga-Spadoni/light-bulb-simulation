"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { io, Socket } from "socket.io-client";
import { CardContentSkeleton } from "@/components/CardContentSkeleton";
import { CardFooterSkeleton } from "@/components/CardFooterSkeleton";
import { MessageData } from "@/lib/types";

enum BulbStates {
  OFF,
  ON,
}

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

const Bulb = ({ name }: { name: string }) => {
  const device_id = "bulb" + name.split(" ")[1];
  const [bulbState, setBulbState] = useState(BulbStates.OFF);
  const [brightness, setBrightness] = useState([50]);
  const [isBulbDimmable, setIsBulbDimmable] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);

  const handleToggle = () => {
    const newState =
      bulbState === BulbStates.ON ? BulbStates.OFF : BulbStates.ON;
    setBulbState(newState);
    const tmp = {
      is_on: newState === BulbStates.ON,
      is_dimmable: isBulbDimmable,
    } as MessageData;
    if (isBulbDimmable) tmp.brightness = brightness[0];
    handleStateChange(tmp);
  };

  const handleBrightness = (brightness: number[]) => {
    setBrightness(brightness);
    handleStateChange({
      is_on: !!bulbState,
      is_dimmable: isBulbDimmable,
      brightness: brightness[0],
    });
  };

  const handleStateChange = (updatedStatus: MessageData) => {
    if (socket) {
      socket.emit("publishState", {
        device_id,
        status: updatedStatus,
      });
    }
  };

  const getImageURI = () => {
    const prefix = "/images";
    return (
      prefix +
      (bulbState === BulbStates.ON
        ? "/light-bulb-ON.jpg"
        : "/light-bulb-OFF.jpg")
    );
  };

  // at component mount, connect to the socket.io server and join the bulb room
  useEffect(() => {
    const sock = io("http://localhost:32623");
    setSocket(sock);

    // generate a random initial state for the bulb
    const initialStatus = {
      is_on: !!getRandomInt(0, 1),
      is_dimmable: !!getRandomInt(0, 1),
    } as MessageData;
    if (initialStatus.is_dimmable)
      initialStatus.brightness = getRandomInt(1, 100);

    sock.emit("join", device_id, initialStatus);

    // listen for state updates from the server (forwarded from the MQTT broker)
    sock.on("syncState", (data: { status: MessageData }) => {
      const { is_on, is_dimmable, brightness } = data.status;
      setBulbState(is_on ? BulbStates.ON : BulbStates.OFF);
      setIsBulbDimmable(is_dimmable);
      if (is_dimmable && brightness) setBrightness([brightness]);
      setIsSyncing(false);
    });

    return () => {
      sock.disconnect();
    };
  }, [device_id]);

  return (
    <Card className="w-64 h-108 dark:bg-gray-800 rounded-lg border border-amber-50">
      <CardHeader className="items-center">
        <CardTitle>{"💡" + name}</CardTitle>
        <CardDescription>
          {isSyncing
            ? "Syncing state with the IoT server..."
            : "✅ State synced!"}
        </CardDescription>
      </CardHeader>
      {isSyncing ? (
        <CardContentSkeleton />
      ) : (
        <CardContent className="flex items-center justify-center px-4">
          <Image
            src={getImageURI()}
            height={200}
            width={150}
            alt="A turned off bulb"
          />
        </CardContent>
      )}
      {isSyncing ? (
        <CardFooterSkeleton />
      ) : (
        <CardFooter className="justify-center">
          <div className="flex flex-col items-center gap-4 w-full">
            <Button onClick={handleToggle}>
              Turn {bulbState === BulbStates.ON ? "OFF" : "ON"}
            </Button>
            {isBulbDimmable && (
              <div className="w-full flex justify-between">
                <Slider
                  className="px-4"
                  disabled={!bulbState}
                  max={100}
                  step={1}
                  value={brightness}
                  onValueChange={handleBrightness}
                />
                <Label>{brightness[0]}</Label>
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Bulb;
