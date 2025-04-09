
import React, { useState, useEffect } from "react";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ConfettiExplosion from "@/components/ConfettiExplosion";

interface CountdownProps {
  name: string;
  month: number;
  day: number;
  message?: string;
}

const Countdown: React.FC<CountdownProps> = ({ name, month, day, message }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
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
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const difference = birthdayThisYear.getTime() - now.getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [month, day]);
  
  const handleShare = async () => {
    // Get the current URL and copy it to clipboard
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };
  
  return (
    <div className="w-full max-w-md birthday-card bg-white">
      {isToday && <ConfettiExplosion />}
      
      <div className="text-center space-y-6">
        {isToday ? (
          <>
            <h1 className="text-3xl font-bold text-birthday">
              🎉 Happy Birthday, {name}! 🎉
            </h1>
            <p className="text-lg">Today is the big day!</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-birthday">
              {name}'s Birthday Countdown
            </h1>
            
            <div className="grid grid-cols-4 gap-2 my-6">
              <div className="flex flex-col items-center">
                <div className="bg-birthday/10 rounded-lg w-20 h-20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-birthday">{timeLeft.days}</span>
                </div>
                <span className="text-xs mt-1 text-muted-foreground">DAYS</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-birthday/10 rounded-lg w-20 h-20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-birthday">{timeLeft.hours}</span>
                </div>
                <span className="text-xs mt-1 text-muted-foreground">HOURS</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-birthday/10 rounded-lg w-20 h-20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-birthday">{timeLeft.minutes}</span>
                </div>
                <span className="text-xs mt-1 text-muted-foreground">MINUTES</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-birthday/10 rounded-lg w-20 h-20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-birthday">{timeLeft.seconds}</span>
                </div>
                <span className="text-xs mt-1 text-muted-foreground">SECONDS</span>
              </div>
            </div>
          </>
        )}
        
        {message && (
          <div className="my-6 px-6 py-4 bg-birthday/5 rounded-lg border border-birthday/20">
            <p className="italic text-gray-700">{message}</p>
          </div>
        )}
        
        <Button 
          onClick={handleShare}
          className="mt-4 flex items-center gap-2 bg-birthday-gold hover:bg-birthday-gold/90 text-white"
        >
          <Share className="h-4 w-4" />
          Share This Countdown
        </Button>
      </div>
    </div>
  );
};

export default Countdown;
