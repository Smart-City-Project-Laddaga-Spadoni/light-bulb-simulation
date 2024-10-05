"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

enum BulbStates {
  OFF,
  ON
}

const Bulb = ({ name }: { name: string }) => {
  const [bulbState, setBulbState] = useState(BulbStates.OFF);
  const [brightness, setBrightness] = useState([50]);

  const handleToggle = () => {
    setBulbState((state) => (state === BulbStates.ON ? BulbStates.OFF : BulbStates.ON));
  };

  const handleBrightness = (value: number[]) => {
    setBrightness(value);
  };

  return (
    <Card>
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
          <Button onClick={handleToggle}>Turn {bulbState === BulbStates.ON ? "OFF" : "ON"}</Button>
          <div className="w-full flex justify-between">
            <Slider disabled={!bulbState} max={100} step={1} value={brightness} onValueChange={handleBrightness} />
            <Label>{brightness[0]}</Label>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Bulb;
