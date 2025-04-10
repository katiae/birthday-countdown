
import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ConfettiExplosion from "@/components/ConfettiExplosion";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useIsMobile } from "@/hooks/use-mobile";

interface CountdownProps {
  name: string;
  month: number;
  day: number;
  message?: string;
  birthdayMessage?: string;
  gifUrl?: string;
  birthdayGifUrl?: string;
  textColor?: string;
}

const Countdown: React.FC<CountdownProps> = ({
  name,
  month,
  day,
  message,
  birthdayMessage,
  gifUrl,
  birthdayGifUrl,
  textColor = "text-zinc-800"
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isToday, setIsToday] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRecycle, setConfettiRecycle] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = isToday ? "Today is your day" : "The countdown begins";
  }, [isToday]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const birthday = new Date(currentYear, month - 1, day);
      
      const isBirthdayToday = 
        now.getDate() === day && 
        now.getMonth() === month - 1;
      
      if (isBirthdayToday) {
        setIsToday(true);
        setShowConfetti(true);
        setConfettiRecycle(true);
        
        setTimeout(() => setConfettiRecycle(false), 1500);
        setTimeout(() => setShowConfetti(false), 8000);
        
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
      
      if (birthday < now) {
        birthday.setFullYear(currentYear + 1);
      }
      
      const difference = birthday.getTime() - now.getTime();
      
      setIsToday(false);
      setShowConfetti(false);
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };
    
    setTimeLeft(calculateTimeLeft());
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
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={confettiRecycle}
          numberOfPieces={200}
          gravity={0.1}
          initialVelocityY={5}
          wind={0.01}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
        />
      )}
      <div className="relative w-full px-0 sm:px-4 mx-auto">
        <Card className="border-gray-200 rounded-3xl overflow-hidden w-full">
          <CardContent className={`p-3 sm:p-6 md:p-10`}>
            {isToday ? (
              <div className="text-center space-y-4">
                <h2 className={`text-2xl sm:text-3xl font-bold ${textColor}`}>Today is your day!</h2>
                {birthdayMessage && (
                  <p className={`text-lg sm:text-xl ${textColor} text-center`}>{birthdayMessage}</p>
                )}
                {birthdayGifUrl && (
                  <div className="mt-6">
                    <img
                      src={birthdayGifUrl}
                      alt="Birthday GIF"
                      className="mx-auto max-h-64 rounded-lg max-w-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor} mb-4 sm:mb-6`}>
                  <span className="block text-center">{`${name}'s birthday in`}</span>
                </h1>
                
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-6 mb-6 sm:mb-8">
                  <div className="flex flex-col items-center">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor} rounded-xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center bg-zinc-100`}>
                      {timeLeft.days}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Days</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor} rounded-xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center bg-zinc-100`}>
                      {timeLeft.hours}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Hours</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor} rounded-xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center bg-zinc-100`}>
                      {timeLeft.minutes}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Minutes</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor} rounded-xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center bg-zinc-100`}>
                      {timeLeft.seconds}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Seconds</span>
                  </div>
                </div>
                
                {message && (
                  <p className={`mt-4 sm:mt-6 text-base sm:text-lg ${textColor} text-center px-2 sm:px-0`}>{message}</p>
                )}
                
                {gifUrl && (
                  <div className="mt-4 sm:mt-8">
                    <img
                      src={gifUrl}
                      alt="Countdown GIF"
                      className="mx-auto max-h-48 sm:max-h-64 rounded-lg max-w-full"
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Countdown;
