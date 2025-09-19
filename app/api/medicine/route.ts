import { getMedicine } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    
    const {illness} = await request.json();


        const medicine = getMedicine(illness);
        console.log(medicine)

          return new Response(JSON.stringify(medicine));
}