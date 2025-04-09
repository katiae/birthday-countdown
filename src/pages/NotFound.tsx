
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cake } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFDEE2]/50 to-[#FDE1D3]/40 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Cake className="h-20 w-20 text-birthday animate-float" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-birthday">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! This page is missing from the party</p>
        <Link to="/">
          <Button className="bg-birthday hover:bg-birthday/90">
            Back to Birthday Sparkle
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
