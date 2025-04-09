
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
}

interface BirthdayContextProps {
  birthdays: Birthday[];
  addBirthday: (name: string, month: number, day: number, message?: string, birthdayMessage?: string, gifUrl?: string) => string;
  getBirthdayById: (id: string) => Birthday | undefined;
}

const BirthdayContext = createContext<BirthdayContextProps | undefined>(undefined);

export const useBirthday = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error("useBirthday must be used within a BirthdayProvider");
  }
  return context;
};

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    const savedBirthdays = localStorage.getItem("birthdays");
    return savedBirthdays ? JSON.parse(savedBirthdays) : [];
  });

  useEffect(() => {
    localStorage.setItem("birthdays", JSON.stringify(birthdays));
  }, [birthdays]);

  const addBirthday = (name: string, month: number, day: number, message?: string, birthdayMessage?: string, gifUrl?: string): string => {
    const id = uuidv4();
    const newBirthday: Birthday = {
      id,
      name,
      month,
      day,
      message,
      birthdayMessage,
      gifUrl
    };
    
    setBirthdays(prev => [...prev, newBirthday]);
    return id;
  };

  const getBirthdayById = (id: string): Birthday | undefined => {
    return birthdays.find(birthday => birthday.id === id);
  };

  return (
    <BirthdayContext.Provider value={{ birthdays, addBirthday, getBirthdayById }}>
      {children}
    </BirthdayContext.Provider>
  );
};
