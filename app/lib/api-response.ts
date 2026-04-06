import { NextResponse } from "next/server";

export const sendError = (message: string, status: number = 500) => {
  return NextResponse.json({ success: false, error: message }, { status });
};

export const sendSuccess = (data: any, status: number = 200) => {
  return NextResponse.json({ success: true, ...data }, { status });
};