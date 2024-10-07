"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const BulbsChooser = () => {
  const router = useRouter();
  const [numBulbs, setNumBulbs] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="dark:bg-gray-800 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            Simulation Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="dark:text-gray-300 mb-2">
            How many bulbs do you want to simulate?:
          </Label>
          <Input
            type="number"
            value={numBulbs}
            onChange={(e) => setNumBulbs(Number(e.target.value))}
            className="mb-4"
            min={1}
            placeholder="Number of bulbs"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push(`/simulation/?bulbs=${numBulbs}`)}
            className="w-full bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors duration-200"
          >
            Start Simulation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BulbsChooser;
