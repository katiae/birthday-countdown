
import React, { useState } from "react";
import { useBirthday } from "@/contexts/BirthdayContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const getDaysInMonth = (month: number) => {
  // Month is 1-indexed in Date
  return new Date(new Date().getFullYear(), month, 0).getDate();
};

const BirthdayForm: React.FC = () => {
  const {
    addBirthday
  } = useBirthday();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  // Initialize with current month (1-indexed to match our dropdown values)
  const [month, setMonth] = useState<number | "">(new Date().getMonth() + 1);
  const [day, setDay] = useState<number | "">(1);
  const [message, setMessage] = useState("");
  const [birthdayMessage, setBirthdayMessage] = useState("");
  const [error, setError] = useState("");
  const daysInSelectedMonth = month !== "" ? getDaysInMonth(month) : 31;

  const handleNextStep = () => {
    setError("");
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }
    if (month === "") {
      setError("Please select a month");
      return;
    }
    if (day === "") {
      setError("Please select a day");
      return;
    }
    
    setStep(2);
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Add the birthday and navigate to the countdown page
    const birthdayId = addBirthday(name, month as number, day as number, message, birthdayMessage);
    toast.success("Birthday countdown created!");
    navigate(`/countdown/${birthdayId}`);
  };

  return (
    <Card className="w-full max-w-md border border-gray-200 rounded-3xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-birthday">
          {step === 1 ? "Create Countdown" : "Customize Birthday Message"}
        </CardTitle>
        <CardDescription className="text-zinc-800">
          {step === 1 
            ? "Add a birthday to create a personalized countdown page" 
            : "Add a special message that will appear on the birthday"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Enter person's name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="border-gray-300 focus:border-gray-400 focus:ring-birthday" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select 
                  value={month.toString()} 
                  onValueChange={value => setMonth(parseInt(value))}
                >
                  <SelectTrigger id="month" className="border-gray-300 focus:border-gray-400">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((monthName, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {monthName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select 
                  value={day.toString()} 
                  onValueChange={value => setDay(parseInt(value))} 
                  disabled={month === ""}
                >
                  <SelectTrigger id="day" className="border-gray-300 focus:border-gray-400 rounded-xl">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: daysInSelectedMonth }, 
                      (_, i) => i + 1
                    ).map(d => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea 
                id="message" 
                placeholder="Add a personal message" 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                className="border-gray-300 focus:border-gray-400 focus:ring-birthday min-h-[100px] resize-none" 
              />
            </div>
            
            {error && <p className="text-destructive text-sm">{error}</p>}
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birthdayMessage">Birthday Message</Label>
              <Textarea 
                id="birthdayMessage" 
                placeholder="Enter a special message to display on the birthday" 
                value={birthdayMessage} 
                onChange={e => setBirthdayMessage(e.target.value)} 
                className="border-gray-300 focus:border-gray-400 focus:ring-birthday min-h-[150px] resize-none" 
              />
              <p className="text-sm text-muted-foreground mt-2">
                This message will only be displayed when it's the actual birthday.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className={step === 2 ? "flex justify-between" : ""}>
        {step === 1 ? (
          <Button 
            onClick={handleNextStep} 
            className="w-full text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl"
          >
            Next Step <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button 
              onClick={handlePrevStep} 
              variant="outline" 
              className="border-gray-300 text-gray-700"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl"
            >
              Create Birthday Countdown
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BirthdayForm;
