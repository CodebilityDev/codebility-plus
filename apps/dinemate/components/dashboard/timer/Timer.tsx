import React, { useEffect, useRef, useState } from "react";
import CircularProgressBar from "./CircularProgressBar";
import { useOrders } from "@/hooks/useOrders";

interface TimerProps {
  minutes: number;
  size: number;
  status?: string;
  orderId: string;
}

const Timer: React.FC<TimerProps> = ({ minutes, size, status, orderId }) => {
  const [progress, setProgress] = useState<number>(100);
  const [timeProgress, setTimeProgress] = useState(minutes * 60);
  const [color, setColor] = useState("#FF680D");
  const intervalRef = useRef<number | null>(null);
  const updateOrderStatus = useOrders((state) => state.updateOrderStatus);

  useEffect(() => {
    if (status === "Preparing") {
      let secondsLeft = minutes * 60;

      const countdownProgress = () => {
        intervalRef.current = window.setInterval(() => {
          if (secondsLeft > 0) {
            secondsLeft--;
            const progressValue = (secondsLeft / (minutes * 60)) * 100;
            setProgress(progressValue);
            setTimeProgress(secondsLeft);
          } else {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              updateOrderStatus(orderId, "Serving");
            }
          }
        }, 1000);
      };

      countdownProgress();
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [minutes, status, updateOrderStatus, orderId]);

  useEffect(() => {
    if (status === "Serving") {
      setColor("");
    } else {
      setColor("#FF680D");
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    const getMinutes = Math.floor(seconds / 60);
    const getSeconds = seconds % 60;
    return `${getMinutes < 10 ? `0${getMinutes}` : getMinutes}:${
      getSeconds < 10 ? `0${getSeconds}` : getSeconds
    }`;
  };

  return (
    <div
      className="relative flex justify-center items-center border-[2px] border-[#1AA845] rounded-full"
      style={{ borderColor: color, width: size + 8, height: size + 8 }}
    >
      <CircularProgressBar
        size={size}
        progress={progress}
        strokeWidth={size / 40 + 1.5}
        circleTwoStroke={color}
      />
      <div
        className="time absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold"
        style={{ fontSize: size / 4 }}
      >
        {formatTime(timeProgress)}
      </div>
    </div>
  );
};

export default Timer;
