
import React, { useState, useEffect } from "react";
import ConfettiExplosion from "@/components/ConfettiExplosion";

interface CountdownProps {
  name: string;
  month: number;
  day: number;
  message?: string;
  birthdayMessage?: string;
}

const Countdown: React.FC<CountdownProps> = ({
  name,
  month,
  day,
  message,
  birthdayMessage
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Create birthday date for this year
      let birthdayThisYear = new Date(currentYear, month - 1, day);

      // If the birthday has already passed this year, use next year's date
      if (birthdayThisYear < now) {
        birthdayThisYear = new Date(currentYear + 1, month - 1, day);
      }

      // Check if birthday is today
      const todayDay = now.getDate();
      const todayMonth = now.getMonth() + 1;
      if (todayDay === day && todayMonth === month) {
        setIsToday(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      const difference = birthdayThisYear.getTime() - now.getTime();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(difference / (1000 * 60 * 60) % 24),
          minutes: Math.floor(difference / 1000 / 60 % 60),
          seconds: Math.floor(difference / 1000 % 60)
        };
      }
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [month, day]);

  const formatDate = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[month - 1]} ${day}`;
  };

  return (
    <div className="w-full max-w-lg overflow-hidden bg-white border border-gray-200 rounded-3xl">
      {isToday && <ConfettiExplosion />}
      
      <div className="p-14 text-center space-y-6 rounded-full">
        {isToday ? (
          <>
            <h1 className="text-3xl font-bold text-birthday-accent">
              Happy Birthday, {name}!
            </h1>
            <p className="text-lg text-birthday-accent">Today is the celebration day</p>
            
            {birthdayMessage && (
              <div className="my-6 px-8 py-6 bg-gray-50 rounded-md border border-gray-100">
                <p className="text-birthday-accent text-base">
                  {birthdayMessage}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-birthday mb-1">
                {name}'s Birthday
              </h1>
              <p className="text-birthday">{formatDate()}</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 my-10">
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 rounded-md w-full py-5 flex items-center justify-center">
                  <span className="text-4xl font-bold text-birthday">{timeLeft.days}</span>
                </div>
                <span className="text-xs mt-2 text-gray-500 font-medium">DAYS</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 rounded-md w-full py-5 flex items-center justify-center">
                  <span className="text-4xl font-bold text-birthday">{timeLeft.hours}</span>
                </div>
                <span className="text-xs mt-2 text-gray-500 font-medium">HOURS</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 rounded-md w-full py-5 flex items-center justify-center">
                  <span className="text-4xl font-bold text-birthday">{timeLeft.minutes}</span>
                </div>
                <span className="text-xs mt-2 text-gray-500 font-medium">MINUTES</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 rounded-md w-full py-5 flex items-center justify-center">
                  <span className="text-4xl font-bold text-birthday">{timeLeft.seconds}</span>
                </div>
                <span className="text-xs mt-2 text-gray-500 font-medium">SECONDS</span>
              </div>
            </div>
          </>
        )}
        
        {message && !isToday && (
          <div className="my-6 px-8 py-5 bg-gray-50 rounded-md border border-gray-100">
            <p className="text-birthday text-base">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Countdown;
