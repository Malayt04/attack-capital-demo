import { getAgent } from "@/lib/functions";
import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {

    const { call } = await request.json();
    console.log("📞 Pre-call webhook received:", {
      event: "call",
      direction: call.direction,
      bot_id: call.bot_id,
      from_number: call.from_number,
      to_number: call.to_number,
      attempt: call.attempt,
    });

    const bot = await getAgent(call.bot_id);
    console.log("Bot info:", bot);

    const domain = bot?.name?.toLowerCase().includes("medical")
      ? "medical"
      : bot?.name?.toLowerCase().includes("legal")
      ? "legal"
      : call.bot_id?.includes("medical")
      ? "medical"
      : "legal";

    console.log("Determined domain:", domain);

    const customerData = getUserData(call.from_number, domain);
    console.log("Customer data:", customerData);


    if (!customerData) {
      console.log(`⚠️ No customer data found for phone: ${call.from_number}`);

      if (parseInt(call.attempt, 10) === 3) {
        console.log(
          "🔄 Final attempt - returning empty variables to allow call to continue"
        );
        return NextResponse.json({
          call: {
            dynamic_variables: {},
          },
        });
      }

      return NextResponse.json(
        { error: "Customer data not found" },
        { status: 500 }
      );
    }

    // Transform customer data into dynamic variables format
    const dynamicVariables = {
      customer_name: customerData.name,
      customer_email: customerData.email,
      customer_phone: customerData.phone,
      customer_address: customerData.address,
      customer_notes: customerData.notes,
      customer_id: customerData.id,
      ...((customerData as any).status && {
        customer_status: (customerData as any).status,
      }),
      ...((customerData as any).tags && {
        customer_tags: (customerData as any).tags.join(", "),
      }),
      ...((customerData as any).lastContacted && {
        last_contacted: (customerData as any).lastContacted,
      }),
    };

    console.log("✅ Returning dynamic variables:", dynamicVariables);

    return NextResponse.json({
      call: {
        dynamic_variables: dynamicVariables,
      },
    });
  } catch (error) {
    console.error("❌ Pre-call webhook error:", error);

    // If this is the 3rd attempt, return empty variables to allow call to continue
    const { call } = await request
      .json()
      .catch(() => ({ call: { attempt: "1" } }));
    if (parseInt(call.attempt, 10) === 3) {
      console.log("🔄 Final attempt - returning empty variables due to error");
      return NextResponse.json({
        call: {
          dynamic_variables: {},
        },
      });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
