import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { mockLegalCustomerData, mockMedicalCustomerData } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserData(phoneNumber: string, domain: string) {
  const user = domain === "medical" ? mockMedicalCustomerData : mockLegalCustomerData;
  return user.find((user) => user.phone === phoneNumber);
}

export function changeDb(phoneNumber:string, domain:string){
  const user = domain === "medical" ? mockMedicalCustomerData : mockLegalCustomerData;
  user.find((user) => user.phone === phoneNumber);
}