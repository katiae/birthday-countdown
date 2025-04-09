import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BirthdayForm from "@/components/BirthdayForm";
import Countdown from "@/components/Countdown";
import { Cake } from "lucide-react";

const Index: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showCountdown, setShowCountdown] = useState(false);
  const [name, setName] = useState("");
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);

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
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold text-birthday flex items-center justify-center gap-2">
          <Cake className="h-8 w-8" />
          <span>Birthday Countdown</span>
        </h1>
        <p className="text-lg text-zinc-800 mt-2">
          Create a personalized birthday countdown for your loved ones
        </p>
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

