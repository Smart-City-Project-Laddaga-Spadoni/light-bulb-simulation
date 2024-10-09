"use client";
import {
  Card,
  CardContent,
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

enum BulbStates {
  OFF,
  ON,
}

type MessageData = {
  is_on: boolean;
  brightness: number;
}

const Bulb = ({ name }: { name: string }) => {
  const device_id = "bulb" + name.split(" ")[1];
  const [bulbState, setBulbState] = useState(BulbStates.OFF);
  const [brightness, setBrightness] = useState([50]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleToggle = () => {
    const newState =
      bulbState === BulbStates.ON ? BulbStates.OFF : BulbStates.ON;
    setBulbState(newState);
    handleStateChange({ is_on: !!newState, brightness: brightness[0] });
  };

  const handleBrightness = (brightness: number[]) => {
    setBrightness(brightness);
    handleStateChange({ is_on: !!bulbState, brightness: brightness[0] });
  };

  const handleStateChange = ({
    is_on,
    brightness,
  }: MessageData) => {
    if (socket) {
      socket.emit("stateChanged", {
        device_id,
        status: { is_on, brightness },
      });
    }
  };

  // at component mount, connect to the socket.io server and join the bulb room
  useEffect(() => {
    const sock = io("http://localhost:32623");
    setSocket(sock);

    sock.emit("join", name);

    // listen for state updates from the server (forwarded from the MQTT broker)
    sock.on("updateState", (data: MessageData) => {
      setBulbState(data.is_on ? BulbStates.ON : BulbStates.OFF);
      setBrightness([data.brightness]);
    });

    return () => {
      sock.disconnect();
    };
  }, [name]);

  return (
    <Card className="dark:bg-gray-800 rounded-lg border border-amber-50">
      <CardHeader className="items-center">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Image
          src={`/images/light-bulb-${BulbStates[bulbState]}.jpg`}
          width={200}
          height={200}
          alt="A turned off bulb"
        />
      </CardContent>
      <CardFooter className="justify-center">
        <div className="flex flex-col items-center gap-4 w-full">
          <Button onClick={handleToggle}>
            Turn {bulbState === BulbStates.ON ? "OFF" : "ON"}
          </Button>
          <div className="w-full flex justify-between">
            <Slider
              disabled={!bulbState}
              max={100}
              step={1}
              value={brightness}
              onValueChange={handleBrightness}
            />
            <Label>{brightness[0]}</Label>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Bulb;
