import GridComponent from "@/components/GridComponent";

export default function Dashboard() {
  const bulbNames: string[] = ["bulb1", "bulb2", "bulb3", "bulb4", "bulb5", "bulb6", "bulb7", "bulb8"];
  return (
    <div
      className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">My bulbs</h1>
      <GridComponent items={bulbNames} />
    </div>
  );
}