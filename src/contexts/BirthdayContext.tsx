import React, { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export type Birthday = {
  id: string;
  name: string;
  month: number;
  day: number;
  message?: string;
  birthdayMessage?: string;
  gifUrl?: string;
  birthdayGifUrl?: string;
  textColor?: string;
  createdAt: number;
};

interface BirthdayContextProps {
  birthdays: Birthday[];
  addBirthday: (name: string, month: number, day: number, message?: string, birthdayMessage?: string, gifUrl?: string, birthdayGifUrl?: string, textColor?: string) => string;
  getBirthdayById: (id: string) => Birthday | undefined;
  getLocalBirthdays: () => Birthday[];
}

const BirthdayContext = createContext<BirthdayContextProps | undefined>(undefined);

export const useBirthday = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error("useBirthday must be used within a BirthdayProvider");
  }
  return context;
};

// Helper function to load birthdays from localStorage
export const getLocalStorageBirthdays = (): Birthday[] => {
  try {
    const savedBirthdays = localStorage.getItem("birthdays");
    return savedBirthdays ? JSON.parse(savedBirthdays) : [];
  } catch (error) {
    console.error("Error loading birthdays from localStorage:", error);
    return [];
  }
};

const setLocalStorageBirthdays = (birthdays: Birthday[]) => {
  try {
    localStorage.setItem("birthdays", JSON.stringify(birthdays));
  } catch (error) {
    console.error("Error updating localStorage:", error);
  }
};

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with data from localStorage directly
  const [birthdays, setBirthdays] = useState<Birthday[]>(getLocalStorageBirthdays());
  
  // Save to localStorage whenever birthdays change
  useEffect(() => {
    if (birthdays.length > 0) {
      localStorage.setItem("birthdays", JSON.stringify(birthdays));
    }
  }, [birthdays]);

  const addBirthday = (
    name: string, 
    month: number, 
    day: number, 
    message?: string, 
    birthdayMessage?: string,
    gifUrl?: string,
    birthdayGifUrl?: string,
    textColor?: string
  ): string => {
    const newBirthday: Birthday = {
      id: uuidv4(),
      name,
      month,
      day,
      message,
      birthdayMessage,
      gifUrl,
      birthdayGifUrl,
      textColor,
      createdAt: Date.now(),
    };

    const updatedBirthdays = [...birthdays, newBirthday];
    setBirthdays(updatedBirthdays);
    setLocalStorageBirthdays(updatedBirthdays);
    
    return newBirthday.id;
  };

  const getBirthdayById = (id: string): Birthday | undefined => {
    // We should prioritize localStorage since it contains the most up-to-date data
    try {
      const localBirthdays = getLocalStorageBirthdays();
      return localBirthdays.find(birthday => birthday.id === id);
    } catch (error) {
      console.error("Error fetching birthday from localStorage:", error);
    }
    
    // Fallback to state if localStorage fails
    return birthdays.find(birthday => birthday.id === id);
  };

  const getLocalBirthdays = (): Birthday[] => {
    return getLocalStorageBirthdays();
  };

  return (
    <BirthdayContext.Provider value={{ birthdays, addBirthday, getBirthdayById, getLocalBirthdays }}>
      {children}
    </BirthdayContext.Provider>
  );
};
