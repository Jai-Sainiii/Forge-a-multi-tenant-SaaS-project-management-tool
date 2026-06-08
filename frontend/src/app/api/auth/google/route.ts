import { NextResponse } from "next/server";

export async function GET() {
  const BACKEND_URL = process.env.BASE_URL_BACKEND;
  return NextResponse.redirect(`${BACKEND_URL}/auth/google`);
}
