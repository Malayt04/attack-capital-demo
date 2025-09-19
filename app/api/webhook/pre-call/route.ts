import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server";

type CustomerData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  id: string | number;
  doctorName?: string;
};

export async function POST(request: Request) {
  try {

    const { call } = await request.json();


    const customerData: CustomerData | undefined = getUserData(call.from_number);
    console.log("Customer data:", customerData);


    if (!customerData) {
      console.log(`No customer data found for phone: ${call.from_number}`);

      if (parseInt(call.attempt, 10) === 3) {
        console.log(
          "Final attempt - returning empty variables to allow call to continue"
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

    const dynamicVariables: Record<string, any> = {
      customer_name: customerData.name,
      customer_email: customerData.email,
      customer_phone: customerData.phone,
      customer_address: customerData.address,
      customer_notes: customerData.notes,
      customer_id: customerData.id,
      customer_doctor: customerData.doctorName,
    };


    console.log("✅ Returning dynamic variables:", dynamicVariables);

    return NextResponse.json({
      call: {
        dynamic_variables: dynamicVariables,
      },
    });
  } catch (error) {
    console.error("❌ Pre-call webhook error:", error);

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
