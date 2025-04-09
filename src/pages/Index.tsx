
import React from "react";
import BirthdayForm from "@/components/BirthdayForm";
import { Cake, PartyPopper } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFDEE2]/50 to-[#FDE1D3]/40 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold text-birthday flex items-center justify-center gap-2">
          <Cake className="h-8 w-8" />
          <span>Birthday Sparkle</span>
          <PartyPopper className="h-8 w-8" />
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Create a special birthday countdown to share with your loved ones!
        </p>
      </div>
      
      <BirthdayForm />
      
      <p className="text-sm text-muted-foreground mt-8">
        Create a birthday countdown and share the link with friends and family.
      </p>
    </div>
  );
};

export default Index;
