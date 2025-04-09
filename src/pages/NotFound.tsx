
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cake } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Cake className="h-20 w-20 text-birthday opacity-50" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-birthday">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link to="/">
          <Button className="bg-birthday hover:bg-birthday/90">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
