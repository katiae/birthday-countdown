
import React, { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Birthday {
  id: string;
  name: string;
  month: number;
  day: number;
  message?: string;
  birthdayMessage?: string;
  gifUrl?: string;
  birthdayGifUrl?: string;
}

interface BirthdayContextProps {
  birthdays: Birthday[];
  addBirthday: (name: string, month: number, day: number, message?: string, birthdayMessage?: string, gifUrl?: string, birthdayGifUrl?: string) => string;
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

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    return getLocalStorageBirthdays();
  });

  useEffect(() => {
    localStorage.setItem("birthdays", JSON.stringify(birthdays));
  }, [birthdays]);

  const addBirthday = (name: string, month: number, day: number, message?: string, birthdayMessage?: string, gifUrl?: string, birthdayGifUrl?: string): string => {
    const id = uuidv4();
    const newBirthday: Birthday = {
      id,
      name,
      month,
      day,
      message,
      birthdayMessage,
      gifUrl,
      birthdayGifUrl
    };
    
    setBirthdays(prev => [...prev, newBirthday]);
    return id;
  };

  const getBirthdayById = (id: string): Birthday | undefined => {
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
