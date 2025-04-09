import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ConfettiExplosion from "@/components/ConfettiExplosion";

interface CountdownProps {
  name: string;
  month: number;
  day: number;
  message?: string;
  birthdayMessage?: string;
  gifUrl?: string;
  birthdayGifUrl?: string;
  textColor?: string;
  isSharedPage?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ 
  name, 
  month, 
  day, 
  message, 
  birthdayMessage, 
  gifUrl, 
  birthdayGifUrl,
  textColor,
  isSharedPage = false
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isToday, setIsToday] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isBehind, setIsBehind] = useState(false);

  useEffect(() => {
    const checkBirthday = () => {
      const now = new Date();
      const todayIsBirthday = 
        now.getDate() === day && 
        now.getMonth() === month - 1;
      
      setIsToday(todayIsBirthday);
      
      if (todayIsBirthday) {
        setShowConfetti(true);
        const confettiTimer = setTimeout(() => {
          setShowConfetti(false);
        }, 8000);
        return () => clearTimeout(confettiTimer);
      }
    };

    // Initial check
    checkBirthday();

    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      let birthdayThisYear = new Date(currentYear, month - 1, day);
      
      if (now > birthdayThisYear) {
        birthdayThisYear = new Date(currentYear + 1, month - 1, day);
        setIsBehind(true);
      } else {
        setIsBehind(false);
      }
      
      const difference = birthdayThisYear.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [month, day]);

  const formatDate = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[month - 1]} ${day}`;
  };

  return (
    <div className="relative w-full max-w-md px-4">
      {showConfetti && <ConfettiExplosion />}
      
      <Card className="border-gray-200 rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          {isToday ? (
            <>
              <h1 className="text-3xl font-bold text-zinc-800">
                Happy Birthday, {name}!
              </h1>
              
              {birthdayMessage && (
                <div className="my-6 px-8 py-6 bg-gray-50 rounded-md border border-gray-100">
                  <p className="text-base text-zinc-800">
                    {birthdayMessage}
                  </p>
                  
                  {birthdayGifUrl && (
                    <div className="mt-3">
                      <img 
                        src={birthdayGifUrl} 
                        alt="Birthday GIF" 
                        className="mx-auto max-h-40 object-contain rounded"
                      />
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 py-0 text-xs"
                          onClick={() => window.open("https://giphy.com/", "_blank")}
                        >
                          <span>Via Giphy</span>
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-zinc-800">
                {isBehind ? "Next Birthday in" : "Birthday in"}
              </h1>
              
              <div className="flex justify-center gap-4 mt-6">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold bg-birthday-accent/10 text-birthday-accent rounded-xl w-16 h-16 flex items-center justify-center">
                    {timeLeft.days}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Days</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold bg-birthday-accent/10 text-birthday-accent rounded-xl w-16 h-16 flex items-center justify-center">
                    {timeLeft.hours}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Hours</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold bg-birthday-accent/10 text-birthday-accent rounded-xl w-16 h-16 flex items-center justify-center">
                    {timeLeft.minutes}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Minutes</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold bg-birthday-accent/10 text-birthday-accent rounded-xl w-16 h-16 flex items-center justify-center">
                    {timeLeft.seconds}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Seconds</span>
                </div>
              </div>
              
              {message && (
                <div className="bg-gray-50 px-6 py-4 rounded-lg border border-gray-100">
                  <p className="text-gray-700 text-sm">{message}</p>
                </div>
              )}

              {gifUrl && (
                <div className="mt-4">
                  <img 
                    src={gifUrl} 
                    alt="GIF" 
                    className="mx-auto max-h-40 object-contain rounded"
                  />
                  <div className="mt-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 py-0 text-xs"
                      onClick={() => window.open("https://giphy.com/", "_blank")}
                    >
                      <span>Via Giphy</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Countdown;
