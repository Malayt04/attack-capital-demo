import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const callData = await request.json();

    console.log("📞 Post-call webhook received:", callData);
    return NextResponse.json({
      success: true,
      message: "Call data processed successfully",
      sessionId: callData.sessionId,
    });
  } catch (error) {
    console.error("❌ Failed to process post-call webhook:", error);

    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}
