import { GoToDashboard } from "@/components/GoToDashboard";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Bulbs simulator</h1>
      <GoToDashboard />
    </div>
  );
}
