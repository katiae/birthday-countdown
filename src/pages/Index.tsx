import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import BirthdayForm from "@/components/BirthdayForm";
import Countdown from "@/components/Countdown";
import { Cake, Plus, Share } from "lucide-react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showCountdown, setShowCountdown] = useState(false);
  const [name, setName] = useState("");
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [message, setMessage] = useState("");
  const [birthdayMessage, setBirthdayMessage] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [birthdayGifUrl, setBirthdayGifUrl] = useState("");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRecycle, setConfettiRecycle] = useState(true);
  const [accentColor, setAccentColor] = useState("birthday-accent");

  useEffect(() => {
    const nameParam = searchParams.get("name");
    const dateParam = searchParams.get("date");
    const msg = searchParams.get("message") || "";
    const bdayMsg = searchParams.get("birthdayMessage") || "";
    const gif = searchParams.get("gifUrl") || "";
    const bdayGif = searchParams.get("birthdayGifUrl") || "";
    const color = searchParams.get("accentColor") || "birthday-accent";

    if (nameParam && dateParam) {
      const [parsedMonth, parsedDay] = dateParam.split("-").map(Number);
      if (!isNaN(parsedMonth) && !isNaN(parsedDay)) {
        setName(nameParam);
        setMonth(parsedMonth);
        setDay(parsedDay);
        setMessage(msg);
        setBirthdayMessage(bdayMsg);
        setGifUrl(gif);
        setBirthdayGifUrl(bdayGif);
        setAccentColor(color);
        setShowCountdown(true);

        const today = new Date();
        if (today.getMonth() + 1 === parsedMonth && today.getDate() === parsedDay) {
          setIsBirthdayToday(true);
          setShowConfetti(true);
          setConfettiRecycle(true);

          setTimeout(() => setConfettiRecycle(false), 1500);
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

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/?name=${encodeURIComponent(name)}&date=${month}-${day}&message=${encodeURIComponent(message)}&birthdayMessage=${encodeURIComponent(birthdayMessage)}&gifUrl=${encodeURIComponent(gifUrl)}&birthdayGifUrl=${encodeURIComponent(birthdayGifUrl)}&accentColor=${encodeURIComponent(accentColor)}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-1000">
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
          <span>{showCountdown ? (isBirthdayToday ? "Today is your day!" : "Birthday Countdown") : "Birthday Countdown"}</span>
        </h1>
        {!showCountdown && (
          <p className="text-lg text-zinc-800 mt-2">
            Create a personalized birthday countdown for your loved ones
          </p>
        )}
      </div>

      {showCountdown ? (
        <div className="flex flex-col items-center">
          <Countdown 
            name={name} 
            month={month} 
            day={day} 
            message={message} 
            birthdayMessage={birthdayMessage} 
            gifUrl={gifUrl} 
            birthdayGifUrl={birthdayGifUrl}
            accentColor={accentColor}
            isSharedPage={true}
          />
          {/* Small floating button for shared page */}
          <Link
            to="/"
            className="fixed bottom-6 right-6 bg-birthday text-white rounded-full p-3 shadow-lg hover:bg-birthday/90 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </Link>
        </div>
      ) : (
        <BirthdayForm />
      )}
    </div>
  );
};

export default Index;
