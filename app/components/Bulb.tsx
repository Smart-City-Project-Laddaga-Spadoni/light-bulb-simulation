"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { socket } from "@/lib/socket";

enum BulbStates {
  OFF,
  ON,
}

const publishNewState = (
  event: string,
  data: { name: string; newState: number },
) => {
  if (socket.connected) socket.emit(event, data);
};

const Bulb = ({ name }: { name: string }) => {
  const [bulbState, setBulbState] = useState(BulbStates.OFF);
  const [brightness, setBrightness] = useState([50]);

  const handleToggle = () => {
    const newState =
      bulbState === BulbStates.ON ? BulbStates.OFF : BulbStates.ON;
    setBulbState(newState);
    if (socket.connected)
      socket.emit("bulb:state", { bulbName: name, newState });
  };

  const handleBrightness = (brightness: number[]) => {
    setBrightness(brightness);
    if (socket.connected)
      socket.emit("bulb:brightness", {
        bulbName: name,
        newBrightness: brightness[0],
      });
  };

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
