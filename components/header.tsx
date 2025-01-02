"use client";

import { ThemeToggle } from "./theme-switcher";
import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-4xl px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-semibold">SpeedTracker</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}