"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const GoToDashboard = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/dashboard")}>Go to dashboard</Button>
  );
};