

export interface Agent {
  id: string;
  name: string;
  domain: string;
  prompt: string;
  uid: string;
}

export interface AgentResponse {
  id: string;
  uid: string;
  name: string;
  prompt: string;
  first_message: string;
  knowledge_base_id?: number;
  [key: string]: any; 
}

export const mockMedicalCustomerData = [
  {
    id: "1",
    name: "Malay Tiwari",
    email: "test.web@example.com",
    phone: "web_call",
    address: "Test Address, Web City, USA",
    notes: "Suffering from seasonal allergies.",
    doctorName: "John Doe"
  },
  {
    id: "4",
    name: "Mayank Dhanik",
    email: "web.client@example.com",
    phone: "Web-Client-1148",
    address: "Web Client Address, Test City, USA",
    notes: "Suffering from chronic back pain.",
    doctorName: "John Doe"
  },
];

export const mockDoctorData = [
  {
    id: "1",
    name: "John Doe",
    email: "test.web@example.com",
    phone: "web_call",
    freeHours: "9:00 AM - 5:00 PM on Monday to Friday",
    address: "Test Address, Web City, USA",
    notes: "Suffering from seasonal allergies.",
  }
]




export const mockIllnessData = [
  {
    name: "headache",
    medicine: ["disprin", "ibuprofen"],
  },
  {
    name: "chronic back pain",
    medicine: ["ibuprofen", "naproxen"],
  }
]