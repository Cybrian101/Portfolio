import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Parse the data from the incoming request
    const data = await request.json();
    const { name, email, message, location } = data;

    // 2. Get server-side information (IP Address, User Agent)
    const ip = request.ip ?? 'IP Not Found';
    const userAgent = request.headers.get('user-agent') ?? 'User Agent Not Found';
    
    // 3. Structure the complete contact submission data
    const contactDetails = {
      name,
      email,
      message,
      location,
      ip,
      userAgent,
      submittedAt: new Date().toISOString(),
    };

    // 4. Log the data to the server (visible in Vercel logs)
    // In a real application, you would save this to a database,
    // send an email, or store it in a persistent file store.
    console.log("New Contact Form Submission:", contactDetails);

    // 5. Send a success response back to the client
    return NextResponse.json({ message: 'Contact information received successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'There was an error processing your request.' }, { status: 500 });
  }
}
