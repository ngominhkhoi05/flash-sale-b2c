"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownProps {
  initialSeconds?: number;
  endTime?: string; // ISO date string
}

export function FlashSaleCountdown({ initialSeconds = 7200, endTime }: CountdownProps) {
  const getInitialSeconds = () => {
    if (endTime) {
      const diff = Math.floor((new Date(endTime).getTime() - Date.now()) / 1000);
      return Math.max(0, diff);
    }
    return initialSeconds;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialSeconds);

  // Re-init when endTime changes
  useEffect(() => {
    setTimeLeft(getInitialSeconds());
  }, [endTime]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatDigit = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
        <Clock className="w-4 h-4 animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
        <span className="hidden sm:inline">KẾT THÚC TRONG:</span>
      </div>
      <div className="flex items-center gap-1 font-extrabold text-sm">
        <span className="bg-gray-900 text-white px-2 py-1 rounded-md border border-gray-800 shadow-xs">
          {formatDigit(hours)}
        </span>
        <span className="text-white font-bold">:</span>
        <span className="bg-gray-900 text-white px-2 py-1 rounded-md border border-gray-800 shadow-xs">
          {formatDigit(minutes)}
        </span>
        <span className="text-white font-bold">:</span>
        <span className="bg-rose-500 text-white px-2 py-1 rounded-md shadow-xs animate-pulse">
          {formatDigit(seconds)}
        </span>
      </div>
    </div>
  );
}
