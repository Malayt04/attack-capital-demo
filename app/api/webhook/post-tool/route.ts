import { NextResponse } from "next/server";
import {
  processCallData,
  updateUserCallHistory,
  analyzeCallSuccess,
  storeCallLog,
} from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const callData = await request.json();

    console.log("📞 Post-call webhook received:", {
      sessionId: callData.sessionId,
      fromPhoneNumber: callData.fromPhoneNumber,
      toPhoneNumber: callData.toPhoneNumber,
      direction: callData.direction,
      isSuccessful: callData.isSuccessful,
      disconnectionReason: callData.disconnectionReason,
    });

    // Validate the request structure
    if (callData.type !== "end-of-call-report") {
      console.error("❌ Invalid post-call webhook type:", callData.type);
      return NextResponse.json(
        { error: "Invalid webhook type" },
        { status: 400 }
      );
    }

    // Process the call data
    const processedData = await processCallData(callData);

    // Update user data based on call outcome
    await updateUserCallHistory(callData);

    // Analyze call success and generate insights
    const callAnalysis = analyzeCallSuccess(callData);

    // Store call log for future reference
    await storeCallLog(callData, processedData, callAnalysis);

    console.log("✅ Post-call webhook processed successfully:", {
      sessionId: callData.sessionId,
      duration: processedData.duration,
      transcriptLength: callData.transcript?.length || 0,
      isSuccessful: callData.isSuccessful,
    });

    // Always respond with 200 OK within 10 seconds (as per Openmic spec)
    return NextResponse.json({
      success: true,
      message: "Call data processed successfully",
      sessionId: callData.sessionId,
    });
  } catch (error) {
    console.error("❌ Failed to process post-call webhook:", error);

    // Still return 200 to prevent webhook retries
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}
