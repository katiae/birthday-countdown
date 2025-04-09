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

  const handleShare = async () => {
    try {
      if (!birthday) throw new Error("No birthday to share");
      
      const shareUrl = `${window.location.origin}/countdown/${birthday.id}`;
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-birthday hover:text-birthday/80 transition-colors">
          <Cake className="h-6 w-6" />
          <span className="text-2xl font-bold">Birthday Countdown</span>
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

      <div className="mt-8 flex gap-4">
        <Link to="/">
          <Button variant="outline" className="border-birthday text-birthday hover:bg-birthday/5">
            Create Your Own
          </Button>
        </Link>
        <Button 
          onClick={handleShare} 
          className="flex items-center gap-2 bg-birthday hover:bg-birthday/90 text-white"
        >
          <Share className="h-4 w-4" />
          Share Countdown
        </Button>
      </div>
    </div>
  );
};

export default CountdownPage;