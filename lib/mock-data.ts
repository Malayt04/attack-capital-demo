

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
  },
  {
    id: "4",
    name: "Mayank Dhanik",
    email: "web.client@example.com",
    phone: "Web-Client-1148",
    address: "Web Client Address, Test City, USA",
    notes: "Suffering from chronic back pain.",
  },
];

export const mockLegalCustomerData = [
  {
    id: "303",
    name: "Monica Geller",
    email: "legal.web@example.com",
    phone: "web_call",
    address: "Legal Test Address, Web City, USA",
    notes: "Case related to intellectual property dispute.",
  },
  {
    id: "304",
    name: "Jhon Doe",
    email: "legal.client@example.com",
    phone: "Web-Client-1148",
    address: "Legal Client Address, Test City, USA",
    notes: "Case related to contract law.",
  },
];

export const mockReceptionistCustomerData = [
  {
    id: "401",
    name: "William Davis",
    email: "william.davis@example.com",
    phone: "web_call",
    address: "123 Main St, Anytown, USA",
    notes: "Requested receptionist assistance for a business contract dispute.",
  },
  {
    id: "402",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    phone: "Web-Client-1148",
    address: "456 Oak Ave, Springfield, USA",
    notes:
      "Requested receptionist assistance for creating meeting with the CEO.",
  },
];
