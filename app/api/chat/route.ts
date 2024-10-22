import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request JSON
    const { message } = await request.json();

    // Validate the input to ensure all required fields are present
    if (!message ) {
      return NextResponse.json({ error: "Input are needed." }, { status: 400 });
    }

    // Get the generative model instance
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the prompt for the generative AI
    const prompt = `${message}`;

    // Generate content using the provided prompt
    // const result = await model.generateContent(prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // // Check if the response object is valid and has text
    // if (!result || !result.text) {
    //   throw new Error("Failed to generate response content.");
    // }

    // Retrieve and return the text response
    return NextResponse.json({ result: text });

  } catch (error) {
    console.error("Error generating crop recommendation:", error);
    return NextResponse.json({ error: "Failed to generate crop recommendation" }, { status: 500 });
  }
}
