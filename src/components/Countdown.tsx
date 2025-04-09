
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
}

const Countdown: React.FC<CountdownProps> = ({ 
  name, 
  month, 
  day, 
  message, 
  birthdayMessage, 
  gifUrl, 
  birthdayGifUrl,
  textColor 
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

  // Calculate next birthday
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Create date object for this year's birthday
      let birthdayThisYear = new Date(currentYear, month - 1, day);
      
      // If birthday has already passed this year, use next year
      if (now > birthdayThisYear) {
        birthdayThisYear = new Date(currentYear + 1, month - 1, day);
        setIsBehind(true);
      } else {
        setIsBehind(false);
      }
      
      // Check if today is the birthday
      const todayIsBirthday = 
        now.getDate() === day && 
        now.getMonth() === month - 1;
      
      if (todayIsBirthday) {
        setIsToday(true);
        setShowConfetti(true);
        
        // Stop confetti after 7 seconds
        setTimeout(() => setShowConfetti(false), 7000);
        
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      } else {
        setIsToday(false);
        
        // Calculate time difference
        const diffTime = birthdayThisYear.getTime() - now.getTime();
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
        
        return {
          days,
          hours,
          minutes,
          seconds
        };
      }
    };

    // Update countdown immediately
    setTimeLeft(calculateTimeLeft());
    
    // Then update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [month, day]);
  
  return (
    <div className="relative w-full max-w-md px-4">
      {showConfetti && <ConfettiExplosion />}
      
      <Card className="shadow-lg border-gray-200 rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          {isToday ? (
            <>
              <h1 className={`text-3xl font-bold ${textColor || 'text-birthday-accent'}`}>
                Happy Birthday, {name}!
              </h1>
              <p className="text-lg text-birthday-accent">Today is the celebration day</p>
              
              {birthdayMessage && (
                <div className="my-6 px-8 py-6 bg-gray-50 rounded-md border border-gray-100">
                  <p className={`text-base ${textColor || 'text-birthday-accent'}`}>
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
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold text-birthday-accent">{name}'s Birthday</h2>
                <div className="flex items-center justify-center mt-2">
                  {isBehind ? <ArrowUp className="h-4 w-4 text-gray-400 mr-1" /> : <ArrowDown className="h-4 w-4 text-gray-400 mr-1" />}
                  <span className="text-sm text-gray-500">
                    {new Date(new Date().getFullYear() + (isBehind ? 1 : 0), month - 1, day).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-8">
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
