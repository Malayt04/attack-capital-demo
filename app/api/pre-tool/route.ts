import { getUserData } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const {call} = await request.json()
    console.log(call)

    try {
        const customerData = getUserData(call.from_number, call.bot_id)
        console.log("Call started to ", call.from_number, " with bot id ", call.bot_id)
        NextResponse.json({
            call: {
              dynamic_variables: customerData
            }
          });
    } catch (error) {
        console.error(error)
        NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}