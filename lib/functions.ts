const token = process.env.OPENMIC_API_KEY;

export interface OpenMicAgent {
  name: string;
  prompt: string;
  first_message: string;
  knowledge_base_id: string;
}

export interface AgentResponse {
  id: string;
  name: string;
  uid: string;
  created_at: string;
  updated_at: string;
}

export interface CallLog {
  id: string;
  bot_id: string;
  status: string;
  duration: number;
  created_at: string;
  transcript?: string;
  summary?: string;
}

export const createAgent = async (
  agent: OpenMicAgent
): Promise<AgentResponse | null> => {
  const url = "https://api.openmic.ai/v1/bots";
  const requestBody = {
    name: agent.name,
    prompt: agent.prompt,
    first_message: agent.first_message,
    knowledge_base_id: agent.knowledge_base_id,
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
    return data.data || data; // Handle different response formats
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
    const data = await response.json();
    return data.data || data; // Handle different response formats
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
