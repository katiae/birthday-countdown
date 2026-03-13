import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";  // Import necessary hooks
import BirthdayForm from "@/components/BirthdayForm";
import Countdown from "@/components/Countdown";  // Import Countdown component
import { Cake, Plus, Share } from "lucide-react";  // For icons
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index: React.FC = () => {
  const [searchParams] = useSearchParams();  // To read URL parameters
  const [showCountdown, setShowCountdown] = useState(false);
  const [name, setName] = useState("");
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [message, setMessage] = useState("");
  const [birthdayMessage, setBirthdayMessage] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [birthdayGifUrl, setBirthdayGifUrl] = useState("");
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRecycle, setConfettiRecycle] = useState(true);
  const [textColor, setTextColor] = useState("text-zinc-800");

  useEffect(() => {
    const nameParam = searchParams.get("name");
    const dateParam = searchParams.get("date");
    const msg = searchParams.get("message") || "";
    const bdayMsg = searchParams.get("birthdayMessage") || "";
    const gifUrl = searchParams.get("gifUrl") || "";
    const bdayGif = searchParams.get("birthdayGifUrl") || "";
    const color = searchParams.get("textColor") || "text-zinc-800";
  
    if (nameParam && dateParam) {
      const [parsedMonth, parsedDay] = dateParam.split("-").map(Number);
      if (!isNaN(parsedMonth) && !isNaN(parsedDay)) {
        setName(nameParam);
        setMonth(parsedMonth);
        setDay(parsedDay);
        setMessage(msg);
        setBirthdayMessage(bdayMsg);
        setGifUrl(gifUrl);
        setBirthdayGifUrl(bdayGif);
        setTextColor(color);
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
  
  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/?name=${encodeURIComponent(name)}&date=${encodeURIComponent(`${month}-${day}`)}&message=${encodeURIComponent(message || '')}&birthdayMessage=${encodeURIComponent(birthdayMessage || '')}&gifUrl=${encodeURIComponent(gifUrl || '')}&birthdayGifUrl=${encodeURIComponent(birthdayGifUrl || '')}&textColor=${encodeURIComponent(textColor || 'text-zinc-800')}`;
      
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-2xl font-bold text-birthday flex items-center justify-center gap-2">
          <Cake className="h-6 w-6" />
          <span>{showCountdown ? "Event Countdown" : "Event countdown"}</span>
        </h1>
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
            textColor={textColor}
          />
          <div className="mt-8 flex gap-4">
            <Button 
              variant="outline" 
              className="border-birthday text-birthday hover:bg-birthday/5"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Create Your Own
            </Button>
            <Button
              onClick={handleShare} 
              className="flex items-center gap-2 bg-birthday hover:bg-birthday/90 text-white"
            >
              <Share className="h-4 w-4" />
              Share Countdown
            </Button>
          </div>
        </div>
      ) : (
        <BirthdayForm />
      )}
    </div>
  );
};

export default Index;
