import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { mockDoctorData, mockIllnessData, mockMedicalCustomerData } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserData(phoneNumber: string) {

    const user = mockMedicalCustomerData.find((user) => user.phone === phoneNumber);
    return user
}


export const getMedicine = (illness: string) => {
  const illnessData = mockIllnessData.find((illnessData) => illnessData.name === illness);
  return illnessData?.medicine;
}

export const getDoctorDetails = (DoctorName: string) => {
  const doctorData = mockDoctorData.find((doctorData) => doctorData.name === DoctorName);
  return doctorData;
}


// Post-call webhook functions

export interface CallData {
  type: string;
  sessionId: string;
  toPhoneNumber: string;
  fromPhoneNumber: string;
  callType: string;
  disconnectionReason: string;
  direction: string;
  createdAt: string;
  endedAt: string;
  transcript: [string, string][];
  summary: string;
  isSuccessful: boolean;
  dynamicVariables: Record<string, any>;
}

export interface ProcessedCallData {
  duration: number;
  durationFormatted: string;
  transcriptLength: number;
  hasTranscript: boolean;
  callQuality: "excellent" | "good" | "poor" | "failed";
  timestamp: string;
}

export interface CallAnalysis {
  successMetrics: {
    isSuccessful: boolean;
    successScore: number;
    callQuality: string;
    engagementLevel: "high" | "medium" | "low";
  };
  insights: {
    keyTopics: string[];
    sentiment: "positive" | "neutral" | "negative";
    actionItems: string[];
    followUpRequired: boolean;
  };
  recommendations: string[];
}





