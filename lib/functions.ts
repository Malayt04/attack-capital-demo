import { AgentResponse } from "./mock-data";

const token = process.env.OPENMIC_API_KEY;

export interface OpenMicAgent {
  name: string;
  prompt: string;
  first_message: string;
}

export interface CallLog {
  call_type: string;
  from_number: string;
  to_number: string;
  direction: string;
  call_id: string;
  agent_id: string;
  call_status: string;
  customer_id?: string;
  start_timestamp: number;
  end_timestamp: number;
  duration_ms: number;
  transcript?: [string, string][];
  recording_url?: string;
  latency?: {
    e2e_min_latency: number;
    e2e_median_latency: number;
    e2e_p90_latency: number;
    llm_min_latency: number;
    llm_median_latency: number;
    llm_p90_latency: number;
    tts_min_latency: number;
    tts_median_latency: number;
    tts_p90_latency: number;
  };
  call_analysis?: {
    summary: string;
    is_successful: boolean;
    success_evaluation: string;
    extracted_data: any;
  };
  call_cost?: {
    total_cost: number;
    llm_cost: number;
    tts_cost: number;
    stt_cost: number;
  };
  dynamic_variables?: {
    [key: string]: any;
  };
}

export interface CallLogsResponse {
  calls: CallLog[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

export const createAgent = async (
  agent: OpenMicAgent
): Promise<AgentResponse | null> => {
  const url = "https://api.openmic.ai/v1/bots";
  const requestBody = {
    name: agent.name,
    prompt: agent.prompt,
    first_message: agent.first_message,
    voice_provider: "OpenAI",
    voice: "alloy",
    voice_model: "tts-1",
    voice_speed: 1,
    llm_model_name: "gpt-4",
    llm_model_temperature: 0.7,
    stt_provider: "Deepgram",
    stt_model: "nova-2",
    call_settings: {
      max_call_duration: 10,
      silence_timeout: 15,
      silence_timeout_max_retries: 3,
      silence_timeout_message: "I didn't hear anything. Are you still there?",
      call_recording_enabled: true,
      voicemail_detection_enabled: true,
      hipaa_compliance_enabled: false,
      pci_compliance_enabled: false,
    },
    advanced_settings: {
      agent_personality: "friendly",
      humanize_conversation: true,
      background_noise_reduction: true,
      allow_interruptions: true,
      min_interruption_duration: 0.5,
      agent_response_length: "normal",
      short_pause: 0.3,
      long_pause: 1,
    },
    post_call_settings: {
      summary_prompt:
        "Provide a brief summary of the customer interaction and any action items.",
      success_evaluation_prompt:
        "Rate the success of this call on a scale of 1-10 based on customer satisfaction.",
      success_evaluation_rubric_type: "NUMERIC_SCALE",
    },
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating agent:", error);
    return null;
  }
};

export const deleteAgent = async (uid: string): Promise<boolean> => {
  const url = `https://api.openmic.ai/v1/bots/${uid}`;
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting agent:", error);
    return false;
  }
};

export const updateAgent = async (
  uid: string,
  updates: Partial<OpenMicAgent>
): Promise<AgentResponse | null> => {
  const url = `https://api.openmic.ai/v1/bots/${uid}`;
  const options = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating agent:", error);
    return null;
  }
};

export const getAgent = async (uid: string): Promise<AgentResponse | null> => {
  const url = `https://api.openmic.ai/v1/bots/${uid}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching agent:", error);
    return null;
  }
};

export const getAllAgents = async (): Promise<AgentResponse[] | null> => {
  const url = "https://api.openmic.ai/v1/bots";
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Full response:", data);
    console.log("Bots array:", data.bots);
    return data.bots || data.data || data; // Access bots array from response
  } catch (error) {
    console.error("Error fetching agents:", error);
    return null;
  }
};

export const getLogs = async (agentId: string): Promise<CallLog[] | null> => {
  const url = `https://api.openmic.ai/v1/calls?bot_id=${agentId}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CallLogsResponse = await response.json();
    console.log("Full response:", data);
    console.log("Calls array:", data.calls);
    return data.calls || [];
  } catch (error) {
    console.error("Error fetching logs:", error);
    return null;
  }
};

export const getLogById = async (logId: string): Promise<CallLog | null> => {
  const url = `https://api.openmic.ai/v1/call/${logId}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching log:", error);
    return null;
  }
};
