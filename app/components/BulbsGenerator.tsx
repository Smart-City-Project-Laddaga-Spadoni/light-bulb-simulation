"use client";
import Bulb from "@/components/Bulb";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const BulbsGeneratorS = () => {
  const searchParams = useSearchParams();
  const bulbsNumber = Number(searchParams.get("bulbs")) || 0;

  const bulbItems = Array.from({ length: bulbsNumber }).map(
    (_, index) => `Bulb ${index + 1}`,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {bulbItems.map((item: string, index: number) => (
        <Bulb key={index} name={item} />
      ))}
    </div>
  );
};

const BulbsGenerator = () => {
  return (
    <Suspense>
      <BulbsGeneratorS />
    </Suspense>
  );
};

export default BulbsGenerator;
