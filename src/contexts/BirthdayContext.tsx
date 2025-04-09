
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

interface BirthdayContextType {
  birthdays: Birthday[];
  addBirthday: (
    name: string, 
    month: number, 
    day: number, 
    message?: string, 
    birthdayMessage?: string,
    gifUrl?: string,
    birthdayGifUrl?: string,
    textColor?: string
  ) => string;
  getBirthdayById: (id: string) => Birthday | undefined;
  removeBirthday: (id: string) => void;
}

const BirthdayContext = createContext<BirthdayContextType>({
  birthdays: [],
  addBirthday: () => "",
  getBirthdayById: () => undefined,
  removeBirthday: () => {},
});

export const getLocalStorageBirthdays = (): Birthday[] => {
  const storedBirthdays = localStorage.getItem("birthdays");
  return storedBirthdays ? JSON.parse(storedBirthdays) : [];
};

const setLocalStorageBirthdays = (birthdays: Birthday[]) => {
  localStorage.setItem("birthdays", JSON.stringify(birthdays));
};

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    const storedBirthdays = getLocalStorageBirthdays();
    setBirthdays(storedBirthdays);
  }, []);

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
    return birthdays.find(birthday => birthday.id === id);
  };
  
  const removeBirthday = (id: string) => {
    const updatedBirthdays = birthdays.filter(birthday => birthday.id !== id);
    setBirthdays(updatedBirthdays);
    setLocalStorageBirthdays(updatedBirthdays);
  };

  return (
    <BirthdayContext.Provider value={{ birthdays, addBirthday, getBirthdayById, removeBirthday }}>
      {children}
    </BirthdayContext.Provider>
  );
};

export const useBirthday = () => useContext(BirthdayContext);
