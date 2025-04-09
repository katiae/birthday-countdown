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
import { ChevronLeft, ChevronRight, Search, Image, ExternalLink, Palette } from "lucide-react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const getDaysInMonth = (month: number) => {
  return new Date(new Date().getFullYear(), month, 0).getDate();
};

const TEXT_COLORS = [
  { name: "Default", value: "default", preview: "#000000" },
  { name: "Vibrant Purple", value: "text-purple-600", preview: "#9b87f5" },
  { name: "Ocean Blue", value: "text-blue-500", preview: "#0EA5E9" },
  { name: "Birthday Pink", value: "text-pink-500", preview: "#D946EF" },
  { name: "Sunset Orange", value: "text-orange-500", preview: "#F97316" },
  { name: "Forest Green", value: "text-green-600", preview: "#16A34A" },
  { name: "Ruby Red", value: "text-red-600", preview: "#DC2626" },
  { name: "Golden Yellow", value: "text-amber-500", preview: "#F59E0B" },
];

const BirthdayForm: React.FC = () => {
  const {
    addBirthday
  } = useBirthday();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [month, setMonth] = useState<number | "">(new Date().getMonth() + 1);
  const [day, setDay] = useState<number | "">(new Date().getDate());
  const [message, setMessage] = useState("");
  const [birthdayMessage, setBirthdayMessage] = useState("");
  const [textColor, setTextColor] = useState("default");
  const [error, setError] = useState("");
  
  const [gifUrl, setGifUrl] = useState<string>("");
  const [gifSearch, setGifSearch] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showGifSelector, setShowGifSelector] = useState(false);
  const [gifSource, setGifSource] = useState<string>("");
  
  const [birthdayGifUrl, setBirthdayGifUrl] = useState<string>("");
  const [birthdayGifSearch, setBirthdayGifSearch] = useState("");
  const [birthdayGifs, setBirthdayGifs] = useState<any[]>([]);
  const [isBirthdayGifSearching, setIsBirthdayGifSearching] = useState(false);
  const [showBirthdayGifSelector, setShowBirthdayGifSelector] = useState(false);
  const [birthdayGifSource, setBirthdayGifSource] = useState<string>("");
  
  const GIPHY_API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchGifs();
    }
  };

  const handleBirthdaySearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBirthdayGifs();
    }
  };
  
  const searchGifs = async () => {
    if (!gifSearch.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    setIsSearching(true);
    setGifs([]);
    
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          gifSearch
        )}&limit=20&offset=0&rating=g&lang=en`
      );
      
      if (!response.ok) {
        throw new Error(`Giphy API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setGifs(data.data);
        
        if (data.data.length === 0) {
          toast.info("No GIFs found for your search");
        }
      } else {
        throw new Error("Unexpected response format from Giphy API");
      }
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      toast.error("Failed to fetch GIFs. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const searchBirthdayGifs = async () => {
    if (!birthdayGifSearch.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    setIsBirthdayGifSearching(true);
    setBirthdayGifs([]);
    
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          birthdayGifSearch
        )}&limit=20&offset=0&rating=g&lang=en`
      );
      
      if (!response.ok) {
        throw new Error(`Giphy API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setBirthdayGifs(data.data);
        
        if (data.data.length === 0) {
          toast.info("No GIFs found for your search");
        }
      } else {
        throw new Error("Unexpected response format from Giphy API");
      }
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      toast.error("Failed to fetch GIFs. Please try again.");
    } finally {
      setIsBirthdayGifSearching(false);
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
    
    const birthdayId = addBirthday(
      name, 
      month as number, 
      day as number, 
      message, 
      birthdayMessage, 
      gifUrl,
      birthdayGifUrl,
      textColor
    );
    toast.success("Birthday countdown created!");
    navigate(`/countdown/${birthdayId}`);
  };

  const selectGif = (url: string, sourceUrl: string) => {
    setGifUrl(url);
    setGifSource(sourceUrl);
    setShowGifSelector(false);
    toast.success("GIF selected!");
  };

  const selectBirthdayGif = (url: string, sourceUrl: string) => {
    setBirthdayGifUrl(url);
    setBirthdayGifSource(sourceUrl);
    setShowBirthdayGifSelector(false);
    toast.success("Birthday GIF selected!");
  };

  const openGiphySource = () => {
    if (gifSource) {
      window.open(gifSource, "_blank");
    } else {
      window.open("https://giphy.com/", "_blank");
    }
  };

  const openBirthdayGiphySource = () => {
    if (birthdayGifSource) {
      window.open(birthdayGifSource, "_blank");
    } else {
      window.open("https://giphy.com/", "_blank");
    }
  };

  const daysInSelectedMonth = month !== "" ? getDaysInMonth(month) : 31;

  return (
    <Card className="w-full max-w-md border border-gray-200 rounded-3xl">
      <CardHeader className="space-y-1 px-8 pt-8">
        <CardTitle className="text-2xl font-bold text-birthday">
          {step === 1 ? "Create Countdown" : "Customize Birthday Message"}
        </CardTitle>
        <CardDescription className="text-zinc-800 text-[16px]">
          {step === 1 
            ? "Add a birthday to create a personalized countdown page" 
            : "Add a special message that will appear on the birthday day"}
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
                  <div className="flex justify-between items-center mt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8"
                      onClick={openGiphySource}
                    >
                      <span>Via Giphy</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white h-8 w-8 p-0"
                      onClick={() => {
                        setGifUrl("");
                        setGifSource("");
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowGifSelector(!showGifSelector)}
                >
                  <Image className="h-4 w-4" />
                  {showGifSelector ? "Hide GIF selector" : "Select a GIF"}
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
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Powered by</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 py-0"
                      onClick={() => window.open("https://giphy.com/", "_blank")}
                    >
                      <span className="font-bold text-sm">GIPHY</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white">
                    {isSearching ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">Loading...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {gifs.map((gif) => (
                          <img
                            key={gif.id}
                            src={gif.images.fixed_height_small.url}
                            alt={gif.title}
                            className="w-full h-20 object-cover cursor-pointer rounded border border-transparent hover:border-birthday"
                            onClick={() => selectGif(gif.images.original.url, gif.url)}
                          />
                        ))}
                        {gifs.length === 0 && gifSearch && !isSearching && (
                          <p className="col-span-2 text-center text-gray-500 py-4">
                            No GIFs found. Try a different search.
                          </p>
                        )}
                        {gifs.length === 0 && !gifSearch && !isSearching && (
                          <p className="col-span-2 text-center text-gray-500 py-4">
                            Loading trending GIFs...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
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

            <div className="space-y-1">
              <Label htmlFor="textColor" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Text Color
              </Label>
              <Select 
                value={textColor} 
                onValueChange={setTextColor}
              >
                <SelectTrigger id="textColor" className="flex items-center gap-2 border-gray-300 focus:border-gray-400">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: TEXT_COLORS.find(color => color.value === textColor)?.preview || TEXT_COLORS[0].preview 
                    }}
                  />
                  <SelectValue placeholder="Select color">
                    {TEXT_COLORS.find(color => color.value === textColor)?.name || "Default"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TEXT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value} className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.preview }}
                        />
                        <span>{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {birthdayMessage && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <p className={`text-center ${textColor !== "default" ? textColor : ''}`}>
                    Preview: {birthdayMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdayGif">Add a GIF for Birthday (Optional)</Label>
              
              {birthdayGifUrl ? (
                <div className="relative">
                  <img 
                    src={birthdayGifUrl} 
                    alt="Selected Birthday GIF" 
                    className="w-full h-32 object-contain border border-gray-300 rounded-lg mb-2" 
                  />
                  <div className="flex justify-between items-center mt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8"
                      onClick={openBirthdayGiphySource}
                    >
                      <span>Via Giphy</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white h-8 w-8 p-0"
                      onClick={() => {
                        setBirthdayGifUrl("");
                        setBirthdayGifSource("");
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowBirthdayGifSelector(!showBirthdayGifSelector)}
                >
                  <Image className="h-4 w-4" />
                  {showBirthdayGifSelector ? "Hide GIF selector" : "Select a birthday GIF"}
                </Button>
              )}
              
              {showBirthdayGifSelector && (
                <div className="mt-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Search for birthday GIFs..."
                      value={birthdayGifSearch}
                      onChange={(e) => setBirthdayGifSearch(e.target.value)}
                      onKeyDown={handleBirthdaySearchKeyDown}
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={searchBirthdayGifs}
                      disabled={isBirthdayGifSearching}
                      className="shrink-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Powered by</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 py-0"
                      onClick={() => window.open("https://giphy.com/", "_blank")}
                    >
                      <span className="font-bold text-sm">GIPHY</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white">
                    {isBirthdayGifSearching ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">Loading...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {birthdayGifs.map((gif) => (
                          <img
                            key={gif.id}
                            src={gif.images.fixed_height_small.url}
                            alt={gif.title}
                            className="w-full h-20 object-cover cursor-pointer rounded border border-transparent hover:border-birthday"
                            onClick={() => selectBirthdayGif(gif.images.original.url, gif.url)}
                          />
                        ))}
                        {birthdayGifs.length === 0 && birthdayGifSearch && !isBirthdayGifSearching && (
                          <p className="col-span-2 text-center text-gray-500 py-4">
                            No GIFs found. Try a different search.
                          </p>
                        )}
                        {birthdayGifs.length === 0 && !birthdayGifSearch && !isBirthdayGifSearching && (
                          <p className="col-span-2 text-center text-gray-500 py-4">
                            Loading trending GIFs...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
