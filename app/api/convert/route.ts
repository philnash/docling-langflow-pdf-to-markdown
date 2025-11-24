import { NextRequest, NextResponse } from 'next/server';
import { LangflowClient } from '@datastax/langflow-client';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mode = formData.get('mode') as string || 'standard';

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate mode
    if (mode !== 'standard' && mode !== 'vlm') {
      return NextResponse.json(
        { success: false, error: 'Invalid mode. Must be "standard" or "vlm"' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Initialize Langflow client
    const client = new LangflowClient({
      baseUrl: process.env.LANGFLOW_BASE_URL,
      apiKey: process.env.LANGFLOW_API_TOKEN,
    });

    // Get the flow
    const flow = client.flow(process.env.LANGFLOW_FLOW_ID!);
    
    // Step 1: Upload the file to Langflow
    const uploadResponse = await client.files.upload(file);
    
    if (!uploadResponse?.path) {
      return NextResponse.json(
        { success: false, error: 'Failed to upload file to Langflow' },
        { status: 500 }
      );
    }

    // Step 2: Run the flow with the uploaded file path and pipeline mode as tweaks
    // The component name should match your Langflow flow's file input component
    const fileComponentName = process.env.LANGFLOW_FILE_COMPONENT_NAME || 'File';
    
    const response = await flow
      .tweak(fileComponentName, {
        path: uploadResponse.path,
        pipeline: mode
      })
      .run('');

    // Extract markdown from response
    const markdown = response?.chatOutputText();

    if (!markdown) {
      return NextResponse.json(
        { success: false, error: 'Failed to extract markdown from response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      markdown,
    });

  } catch (error) {
    console.error('Conversion error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
