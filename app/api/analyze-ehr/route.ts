import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined');
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const ehrData = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze the following Electronic Health Record data and provide:
    1. A brief patient summary
    2. A risk assessment
    3. Recommended actions

    EHR Data:
    ${JSON.stringify(ehrData, null, 2)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the generated text into structured data
    const lines = text.split('\n');
    const patientSummary = lines.find((line: string) => line.startsWith('Patient Summary:'))?.replace('Patient Summary:', '').trim();
    const riskAssessment = lines.find((line: string) => line.startsWith('Risk Assessment:'))?.replace('Risk Assessment:', '').trim();
    const recommendedActions = lines
      .slice(lines.findIndex((line: string) => line.startsWith('Recommended Actions:')) + 1)
      .filter((line: string) => line.trim().startsWith('-'))
      .map((line: string) => line.trim().replace('-', '').trim());

    return Response.json({
      patientSummary,
      riskAssessment,
      recommendedActions
    });
  } catch (error) {
    console.error('Error processing EHR data:', error);
    return Response.json({ error: 'An error occurred while processing the EHR data' }, { status: 500 });
  }
}