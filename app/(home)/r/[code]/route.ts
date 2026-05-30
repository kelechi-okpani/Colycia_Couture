import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  // 1. Type params as a Promise
  props: { params: Promise<{ code: string }> } 
) {
  // 2. Await the params before trying to use 'code'
  const params = await props.params;
  const code = params.code;

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  // Construct the final destination with the query parameter
  const destinationUrl = new URL(`/?ref=${code}`, baseUrl);

  // Perform a temporary redirect (307) to the homepage
  return NextResponse.redirect(destinationUrl);
}