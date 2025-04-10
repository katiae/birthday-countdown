import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBirthday, getLocalStorageBirthdays, Birthday } from "@/contexts/BirthdayContext";
import Countdown from "@/components/Countdown";
import { Button } from "@/components/ui/button";
import { Cake, Share } from "lucide-react";
import { toast } from "sonner";

const CountdownPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBirthdayById } = useBirthday();
  const [birthday, setBirthday] = useState<Birthday | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const localBirthdays = getLocalStorageBirthdays();
    const foundBirthday = localBirthdays.find(b => b.id === id);

    if (foundBirthday) {
      setBirthday(foundBirthday);
      setIsLoading(false);
      return;
    }

    const contextBirthday = getBirthdayById(id);
    if (contextBirthday) {
      setBirthday(contextBirthday);
    }

    setIsLoading(false);
  }, [id, getBirthdayById]);

  useEffect(() => {
    if (birthday) {
      const now = new Date();
      const todayIsBirthday = 
        now.getDate() === birthday.day && 
        now.getMonth() === birthday.month - 1;
      
      document.title = todayIsBirthday ? "Today is the day" : "The countdown begins";
    } else {
      document.title = "Birthday Countdown";
    }
  }, [birthday]);

  const handleShare = async () => {
    try {
      if (!birthday) throw new Error("No birthday to share");
      
      const shareUrl = `${window.location.origin}/?name=${encodeURIComponent(birthday.name)}&date=${encodeURIComponent(`${birthday.month}-${birthday.day}`)}&message=${encodeURIComponent(birthday.message || '')}&birthdayMessage=${encodeURIComponent(birthday.birthdayMessage || '')}&gifUrl=${encodeURIComponent(birthday.gifUrl || '')}&birthdayGifUrl=${encodeURIComponent(birthday.birthdayGifUrl || '')}&textColor=${encodeURIComponent(birthday.textColor || 'text-zinc-800')}`;
      
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p>Loading countdown...</p>
        </div>
      </div>
    );
  }

  if (!birthday) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-birthday">Birthday Not Found</h1>
          <p className="text-muted-foreground">
            This birthday countdown doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button className="bg-birthday hover:bg-birthday/90">
              Create a New Countdown
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl text-center mb-4 sm:mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-birthday hover:text-birthday/80 transition-colors">
          <Cake className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-xl sm:text-2xl font-bold">Birthday Countdown</span>
        </Link>
      </div>

      <Countdown 
        name={birthday.name}
        month={birthday.month}
        day={birthday.day}
        message={birthday.message}
        birthdayMessage={birthday.birthdayMessage}
        gifUrl={birthday.gifUrl}
        birthdayGifUrl={birthday.birthdayGifUrl}
        textColor={birthday.textColor}
      />

      <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
        <Link to="/">
          <Button variant="outline" className="border-birthday text-birthday hover:bg-birthday/5 text-sm sm:text-base">
            Create Your Own
          </Button>
        </Link>
        <Button
          onClick={handleShare} 
          className="flex items-center gap-1 sm:gap-2 bg-birthday hover:bg-birthday/90 text-white text-sm sm:text-base"
        >
          <Share className="h-3 w-3 sm:h-4 sm:w-4" />
          Share Countdown
        </Button>
      </div>
    </div>
  );
};

export default CountdownPage;
