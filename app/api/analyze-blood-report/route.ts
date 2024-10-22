import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    console.log('Received request to analyze blood report');
    const data = await request.formData();
    const image = data.get('image') as File;

    if (!image) {
      console.error('No image provided in the request');
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    console.log('Image received:', image.name, image.type, image.size);

    // Convert the image to a byte array
    const imageBytes = await image.arrayBuffer();

    // Initialize the model
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Analyze the image
    console.log('Sending image to Gemini for analysis...');
    const result = await model.generateContent([
      'Analyze the image of a blood report provided and offer a detailed interpretation. The analysis should follow this structure:' +
      '1. **List of Tests Performed**: Clearly list all tests shown in the report with their corresponding values. Briefly explain what each test measures and its significance.' +
      '2. **Normal and Abnormal Results**: Identify tests outside the normal range, explaining why they are abnormal and their potential implications.' +
      '3. **Overall Health Assessment**: Provide an assessment of the patient’s overall health based on the results and patterns observed.' +
      '4. **Recommendations and Next Steps**: Suggest follow-up actions, tests, or lifestyle changes and explain why they are necessary.',
      { inlineData: { data: Buffer.from(imageBytes).toString('base64'), mimeType: image.type } },
    ]);

    const response = await result.response;
    const analysis = response.text();

    console.log('Analysis completed successfully');
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing blood report:', error);
    return NextResponse.json({ error: `Failed to analyze blood report: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
  }
}
