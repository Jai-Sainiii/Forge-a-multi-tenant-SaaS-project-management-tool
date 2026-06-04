import { NextResponse } from "next/server";

export async function GET() {
  const BACKEND_URL = process.env.BASE_URL_BACKEND || "http://localhost:5000";
  return NextResponse.redirect(`${BACKEND_URL}/auth/google`);
}
