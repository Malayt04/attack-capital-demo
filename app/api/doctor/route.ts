import { getDoctorDetails } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {doctorName} = await request.json();
    console.log("👨🏻‍⚕️ Doctor name:", doctorName);
    const doctorData = getDoctorDetails(doctorName);
    console.log("👨🏻‍⚕️ Doctor data:", doctorData);
    return NextResponse.json(doctorData);
}