
import React, { useState, useEffect } from "react";
import { useBirthday } from "@/contexts/BirthdayContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Search, Image } from "lucide-react";

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

  // Giphy search states
  const [gifUrl, setGifUrl] = useState<string>("");
  const [gifSearch, setGifSearch] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showGifSelector, setShowGifSelector] = useState(false);
  
  const GIPHY_API_KEY = "HSywBBfgSLZraR9nrthjwbdMc2bLW9Ti"; // Public API key for Giphy
  
  // Search for GIFs when the user types in the search box
  const searchGifs = async () => {
    if (!gifSearch.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          gifSearch
        )}&limit=20&offset=0&rating=g&lang=en`
      );
      const data = await response.json();
      setGifs(data.data);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      toast.error("Failed to fetch GIFs. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };
  
  // When the user presses Enter in the search input, trigger search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchGifs();
    }
  };

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
    const birthdayId = addBirthday(name, month as number, day as number, message, birthdayMessage, gifUrl);
    toast.success("Birthday countdown created!");
    navigate(`/countdown/${birthdayId}`);
  };

  const selectGif = (url: string) => {
    setGifUrl(url);
    setShowGifSelector(false);
    toast.success("GIF selected!");
  };

  return (
    <Card className="w-full max-w-md border border-gray-200 rounded-3xl">
      <CardHeader className="space-y-1 px-8 pt-8">
        <CardTitle className="text-2xl font-bold text-birthday">
          {step === 1 ? "Create Countdown" : "Customize Birthday Message"}
        </CardTitle>
        <CardDescription className="text-zinc-800 text-[16px]">
          {step === 1 
            ? "Add a birthday to create a personalized countdown page" 
            : "Add a special message that will appear on the birthday"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8">
        {step === 1 ? (
          <form className="space-y-4">
            <div className="space-y-1">
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
              <div className="space-y-1">
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
              
              <div className="space-y-1">
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
            
            <div className="space-y-1">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea 
                id="message" 
                placeholder="Add a personal message" 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                className="border-gray-300 focus:border-gray-400 focus:ring-birthday min-h-[100px] resize-none" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gif">Add a GIF (Optional)</Label>
              
              {gifUrl ? (
                <div className="relative">
                  <img 
                    src={gifUrl} 
                    alt="Selected GIF" 
                    className="w-full h-32 object-contain border border-gray-300 rounded-lg mb-2" 
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white h-8 w-8 p-0"
                    onClick={() => setGifUrl("")}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowGifSelector(!showGifSelector)}
                >
                  <Image className="h-4 w-4" />
                  Select a GIF
                </Button>
              )}
              
              {showGifSelector && (
                <div className="mt-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Search for GIFs..."
                      value={gifSearch}
                      onChange={(e) => setGifSearch(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={searchGifs}
                      disabled={isSearching}
                      className="shrink-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {isSearching ? (
                    <div className="h-40 flex items-center justify-center">
                      <p>Loading...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {gifs.map((gif) => (
                        <img
                          key={gif.id}
                          src={gif.images.fixed_height_small.url}
                          alt={gif.title}
                          className="w-full h-20 object-cover cursor-pointer rounded border border-transparent hover:border-birthday"
                          onClick={() => selectGif(gif.images.original.url)}
                        />
                      ))}
                      {gifs.length === 0 && gifSearch && (
                        <p className="col-span-2 text-center text-gray-500 py-4">
                          No GIFs found. Try a different search.
                        </p>
                      )}
                      {gifs.length === 0 && !gifSearch && (
                        <p className="col-span-2 text-center text-gray-500 py-4">
                          Search for a GIF to add to your birthday message.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {error && <p className="text-destructive text-sm">{error}</p>}
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
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
      <CardFooter className={`px-8 pb-8 ${step === 2 ? "flex justify-between" : ""}`}>
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
