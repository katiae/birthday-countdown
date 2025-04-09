
import React from "react";
import BirthdayForm from "@/components/BirthdayForm";
import { Cake } from "lucide-react";

const Index: React.FC = () => {
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
      
      <BirthdayForm />
    </div>
  );
};

export default Index;
