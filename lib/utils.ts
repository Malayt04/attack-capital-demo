import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { mockLegalCustomerData, mockMedicalCustomerData, mockReceptionistCustomerData } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserData(phoneNumber: string, domain: string) {
  let user;
  if (domain === "medical") {
    user = mockMedicalCustomerData.find((user) => user.phone === phoneNumber);
  }
  else if (domain === "legal") {
    user = mockLegalCustomerData.find((user) => user.phone === phoneNumber);
  } 
  else {
    user = mockReceptionistCustomerData.find((user) => user.phone === phoneNumber);
  }
  return user;
}

export function updateUserData(
  phoneNumber: string,
  domain: string,
  updates: any
) {
  const userData =
    domain === "medical" ? mockMedicalCustomerData : mockLegalCustomerData;
  const userIndex = userData.findIndex((user) => user.phone === phoneNumber);

  if (userIndex !== -1) {
    userData[userIndex] = {
      ...userData[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    console.log(`✅ Updated user data for ${phoneNumber}:`, updates);
    return userData[userIndex];
  }

  console.log(`❌ User not found for phone number: ${phoneNumber}`);
  return null;
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

export async function processCallData(
  callData: CallData
): Promise<ProcessedCallData> {
  try {
    console.log("🔄 Processing call data for session:", callData.sessionId);

    // Calculate call duration
    const startTime = new Date(callData.createdAt);
    const endTime = new Date(callData.endedAt);
    const duration = endTime.getTime() - startTime.getTime();
    const durationFormatted = formatDuration(duration);

    // Analyze transcript
    const transcriptLength = callData.transcript?.length || 0;
    const hasTranscript = transcriptLength > 0;

    // Determine call quality
    const callQuality = determineCallQuality(
      callData,
      duration,
      transcriptLength
    );

    const processedData: ProcessedCallData = {
      duration,
      durationFormatted,
      transcriptLength,
      hasTranscript,
      callQuality,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Call data processed:", {
      duration: durationFormatted,
      transcriptLength,
      callQuality,
    });

    return processedData;
  } catch (error) {
    console.error("❌ Error processing call data:", error);
    throw error;
  }
}

export async function updateUserCallHistory(callData: CallData): Promise<void> {
  try {
    console.log("📝 Updating user call history for:", callData.fromPhoneNumber);

    // Determine domain from sessionId or use default logic
    const domain = callData.sessionId.includes("medical") ? "medical" : "legal";

    // Find user data
    const userData = getUserData(callData.fromPhoneNumber, domain);

    if (userData) {
      // Prepare call history update
      const callHistoryUpdate = {
        lastCallDate: callData.endedAt,
        lastCallDuration: calculateDuration(
          callData.createdAt,
          callData.endedAt
        ),
        lastCallSuccess: callData.isSuccessful,
        lastCallReason: callData.disconnectionReason,
        totalCalls: (userData.totalCalls || 0) + 1,
        successfulCalls:
          (userData.successfulCalls || 0) + (callData.isSuccessful ? 1 : 0),
        lastCallSummary: callData.summary,
      };

      // Update user data
      updateUserData(callData.fromPhoneNumber, domain, callHistoryUpdate);

      console.log("✅ User call history updated:", {
        phone: callData.fromPhoneNumber,
        totalCalls: callHistoryUpdate.totalCalls,
        successfulCalls: callHistoryUpdate.successfulCalls,
      });
    } else {
      console.log(
        "⚠️ User not found for phone number:",
        callData.fromPhoneNumber
      );
    }
  } catch (error) {
    console.error("❌ Error updating user call history:", error);
    // Don't throw error to prevent webhook failure
  }
}

export function analyzeCallSuccess(callData: CallData): CallAnalysis {
  try {
    console.log("📊 Analyzing call success for session:", callData.sessionId);

    // Calculate success metrics
    const successScore = calculateSuccessScore(callData);
    const engagementLevel = calculateEngagementLevel(callData);
    const callQuality = determineCallQuality(
      callData,
      0,
      callData.transcript?.length || 0
    );

    // Extract insights from transcript and summary
    const keyTopics = extractKeyTopics(callData.transcript, callData.summary);
    const sentiment = analyzeSentiment(callData.transcript, callData.summary);
    const actionItems = extractActionItems(callData.summary);
    const followUpRequired = determineFollowUpRequired(callData);

    // Generate recommendations
    const recommendations = generateRecommendations(
      callData,
      successScore,
      engagementLevel
    );

    const analysis: CallAnalysis = {
      successMetrics: {
        isSuccessful: callData.isSuccessful,
        successScore,
        callQuality,
        engagementLevel,
      },
      insights: {
        keyTopics,
        sentiment,
        actionItems,
        followUpRequired,
      },
      recommendations,
    };

    console.log("✅ Call analysis completed:", {
      successScore,
      engagementLevel,
      sentiment,
      followUpRequired,
    });

    return analysis;
  } catch (error) {
    console.error("❌ Error analyzing call success:", error);

    // Return default analysis on error
    return {
      successMetrics: {
        isSuccessful: callData.isSuccessful,
        successScore: callData.isSuccessful ? 7 : 3,
        callQuality: "poor",
        engagementLevel: "low",
      },
      insights: {
        keyTopics: [],
        sentiment: "neutral",
        actionItems: [],
        followUpRequired: false,
      },
      recommendations: ["Review call logs for improvement opportunities"],
    };
  }
}

export async function storeCallLog(
  callData: CallData,
  processedData: ProcessedCallData,
  analysis: CallAnalysis
): Promise<void> {
  try {
    console.log("💾 Storing call log for session:", callData.sessionId);

    // Create comprehensive call log entry
    const callLogEntry = {
      id: callData.sessionId,
      sessionId: callData.sessionId,
      callId: callData.sessionId, // Using sessionId as callId
      date: callData.createdAt,
      duration: processedData.durationFormatted,
      transcript: formatTranscript(callData.transcript),
      summary: callData.summary,
      timeTaken: processedData.durationFormatted,
      isSuccessful: callData.isSuccessful,
      disconnectionReason: callData.disconnectionReason,
      direction: callData.direction,
      fromPhoneNumber: callData.fromPhoneNumber,
      toPhoneNumber: callData.toPhoneNumber,
      dynamicVariables: callData.dynamicVariables,
      analysis: analysis,
      processedData: processedData,
      createdAt: new Date().toISOString(),
    };

    // In a real application, you would store this in a database
    // For now, we'll just log it
    console.log("📋 Call log entry created:", {
      sessionId: callLogEntry.sessionId,
      duration: callLogEntry.duration,
      isSuccessful: callLogEntry.isSuccessful,
      transcriptLength: callLogEntry.transcript.length,
    });

    // TODO: Implement actual database storage
    // await database.callLogs.create(callLogEntry);
  } catch (error) {
    console.error("❌ Error storing call log:", error);
    // Don't throw error to prevent webhook failure
  }
}

// Helper functions for call analysis

function formatDuration(durationMs: number): string {
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = end.getTime() - start.getTime();
  return formatDuration(duration);
}

function determineCallQuality(
  callData: CallData,
  duration: number,
  transcriptLength: number
): "excellent" | "good" | "poor" | "failed" {
  if (!callData.isSuccessful || transcriptLength === 0) {
    return "failed";
  }

  if (duration < 30000) {
    // Less than 30 seconds
    return "poor";
  } else if (duration < 120000 && transcriptLength < 5) {
    // Less than 2 minutes and few exchanges
    return "poor";
  } else if (duration > 300000 && transcriptLength > 10) {
    // More than 5 minutes and good conversation
    return "excellent";
  } else {
    return "good";
  }
}

function calculateSuccessScore(callData: CallData): number {
  let score = 0;

  // Base score from isSuccessful
  score += callData.isSuccessful ? 5 : 0;

  // Duration bonus
  const duration =
    new Date(callData.endedAt).getTime() -
    new Date(callData.createdAt).getTime();
  if (duration > 120000) score += 2; // More than 2 minutes
  if (duration > 300000) score += 1; // More than 5 minutes

  // Transcript quality
  const transcriptLength = callData.transcript?.length || 0;
  if (transcriptLength > 5) score += 1;
  if (transcriptLength > 10) score += 1;

  // Summary quality
  if (callData.summary && callData.summary.length > 50) score += 1;

  return Math.min(score, 10); // Cap at 10
}

function calculateEngagementLevel(
  callData: CallData
): "high" | "medium" | "low" {
  const transcriptLength = callData.transcript?.length || 0;
  const duration =
    new Date(callData.endedAt).getTime() -
    new Date(callData.createdAt).getTime();

  if (transcriptLength > 8 && duration > 180000) {
    // More than 8 exchanges and 3 minutes
    return "high";
  } else if (transcriptLength > 4 && duration > 60000) {
    // More than 4 exchanges and 1 minute
    return "medium";
  } else {
    return "low";
  }
}

function extractKeyTopics(
  transcript: [string, string][],
  summary: string
): string[] {
  const topics: string[] = [];

  // Extract topics from summary
  if (summary) {
    const summaryLower = summary.toLowerCase();
    if (
      summaryLower.includes("appointment") ||
      summaryLower.includes("booking")
    ) {
      topics.push("appointment_booking");
    }
    if (
      summaryLower.includes("transfer") ||
      summaryLower.includes("escalate")
    ) {
      topics.push("call_transfer");
    }
    if (summaryLower.includes("support") || summaryLower.includes("help")) {
      topics.push("customer_support");
    }
    if (summaryLower.includes("product") || summaryLower.includes("service")) {
      topics.push("product_inquiry");
    }
  }

  return topics;
}

function analyzeSentiment(
  transcript: [string, string][],
  summary: string
): "positive" | "neutral" | "negative" {
  const text = summary.toLowerCase();

  const positiveWords = [
    "happy",
    "satisfied",
    "great",
    "excellent",
    "thank",
    "perfect",
    "good",
  ];
  const negativeWords = [
    "angry",
    "frustrated",
    "disappointed",
    "bad",
    "terrible",
    "awful",
    "hate",
  ];

  const positiveCount = positiveWords.filter((word) =>
    text.includes(word)
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    text.includes(word)
  ).length;

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

function extractActionItems(summary: string): string[] {
  const actionItems: string[] = [];

  if (summary.toLowerCase().includes("follow up")) {
    actionItems.push("schedule_follow_up");
  }
  if (summary.toLowerCase().includes("callback")) {
    actionItems.push("schedule_callback");
  }
  if (summary.toLowerCase().includes("appointment")) {
    actionItems.push("book_appointment");
  }

  return actionItems;
}

function determineFollowUpRequired(callData: CallData): boolean {
  const summary = callData.summary.toLowerCase();
  const transcript =
    callData.transcript
      ?.map(([, message]) => message.toLowerCase())
      .join(" ") || "";

  const followUpIndicators = [
    "follow up",
    "callback",
    "appointment",
    "schedule",
    "book",
    "reserve",
    "contact again",
    "call back",
    "next steps",
  ];

  return followUpIndicators.some(
    (indicator) => summary.includes(indicator) || transcript.includes(indicator)
  );
}

function generateRecommendations(
  callData: CallData,
  successScore: number,
  engagementLevel: string
): string[] {
  const recommendations: string[] = [];

  if (successScore < 5) {
    recommendations.push("Review call script and agent responses");
  }

  if (engagementLevel === "low") {
    recommendations.push("Improve conversation engagement techniques");
  }

  if (
    callData.disconnectionReason === "user_ended_call" &&
    !callData.isSuccessful
  ) {
    recommendations.push("Analyze early call termination patterns");
  }

  if (callData.transcript?.length === 0) {
    recommendations.push("Investigate call connection issues");
  }

  return recommendations;
}

function formatTranscript(transcript: [string, string][]): string {
  if (!transcript || transcript.length === 0) {
    return "No transcript available";
  }

  return transcript
    .map(([speaker, message]) => `${speaker}: ${message}`)
    .join("\n");
}
