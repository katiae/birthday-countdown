
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useBirthday } from "@/contexts/BirthdayContext";
import Countdown from "@/components/Countdown";
import { Button } from "@/components/ui/button";
import { Cake, Share } from "lucide-react";
import { toast } from "sonner";

const CountdownPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBirthdayById } = useBirthday();
  
  const birthday = id ? getBirthdayById(id) : undefined;
  
  const handleShare = async () => {
    // Get the current URL and copy it to clipboard
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };
  
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
