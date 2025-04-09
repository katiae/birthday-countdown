import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BirthdayForm from "@/components/BirthdayForm";
import Countdown from "@/components/Countdown";
import { Cake } from "lucide-react";
import Confetti from "react-confetti";

const Index: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showCountdown, setShowCountdown] = useState(false);
  const [name, setName] = useState("");
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRecycle, setConfettiRecycle] = useState(true);

  useEffect(() => {
    const nameParam = searchParams.get("name");
    const dateParam = searchParams.get("date");

    if (nameParam && dateParam) {
      const [parsedMonth, parsedDay] = dateParam.split("-").map(Number);
      if (!isNaN(parsedMonth) && !isNaN(parsedDay)) {
        setName(nameParam);
        setMonth(parsedMonth);
        setDay(parsedDay);
        setShowCountdown(true);

        const today = new Date();
        if (today.getMonth() + 1 === parsedMonth && today.getDate() === parsedDay) {
          setIsBirthdayToday(true);
          setShowConfetti(true);
          setConfettiRecycle(true);

          // Let confetti fall, then stop recycling to simulate it falling out of view
          setTimeout(() => setConfettiRecycle(false), 1500);

          // After it's done falling, fully remove the confetti
          setTimeout(() => setShowConfetti(false), 8000);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {showCountdown && isBirthdayToday && showConfetti && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          recycle={confettiRecycle} 
          numberOfPieces={300} 
          gravity={0.3}
        />
      )}

      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold text-birthday flex items-center justify-center gap-2">
          <Cake className="h-8 w-8" />
          <span>{showCountdown ? (isBirthdayToday ? "Today is the day!" : "The countdown begins") : "Birthday Countdown"}</span>
        </h1>
        {!showCountdown && (
          <p className="text-lg text-zinc-800 mt-2">
            Create a personalized birthday countdown for your loved ones
          </p>
        )}
      </div>

      {showCountdown ? (
        <Countdown name={name} month={month} day={day} />
      ) : (
        <BirthdayForm />
      )}
    </div>
  );
};

export default Index;
