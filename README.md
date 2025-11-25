# PDF to Markdown Converter

A Next.js application that converts PDF files to Markdown format using [Langflow](https://langflow.org) and the [File component](https://docs.langflow.org/components-data#file) powered by [Docling](https://www.docling.ai/).

## Features

- 📄 **PDF Upload**: Drag-and-drop or click to browse interface
- 🔄 **Real-time Conversion**: Convert PDFs to Markdown using Langflow
- 📋 **Copy to Clipboard**: Easily copy the converted Markdown
- 💾 **Download**: Save the Markdown as a .md file
- ✨ **Modern UI**: Clean, responsive design with dark mode support
- ⚡ **Fast**: Built with Next.js 16 and React 19
- 🛡️ **Validation**: File type and size validation (10MB limit)

## Prerequisites

- Node.js 20 or higher
- npm
- A Langflow instance with a PDF to Markdown conversion flow

You can find the example flow in [the flow directory](./flow/pdf-to-markdown.json). Upload this JSON file to Langflow to recreate the flow.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd docling-pdf-to-markdown
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Langflow credentials:
```env
LANGFLOW_BASE_URL=https://your-langflow-instance.com
LANGFLOW_API_TOKEN=your-api-token-here
LANGFLOW_FLOW_ID=your-flow-id-here
LANGFLOW_FILE_COMPONENT_NAME=your-file-component-id-here
```

## Usage

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Upload**: User uploads a PDF file via drag-and-drop or file browser
2. **Validation**: File is validated for type (PDF only) and size (max 10MB)
3. **Conversion**: File is sent to the Langflow API for processing
4. **Display**: Converted Markdown is displayed with copy and download options

## Project Structure

```
docling-pdf-to-markdown/
├── app/
│   ├── api/
│   │   └── convert/
│   │       └── route.ts          # API endpoint for PDF conversion
│   ├── components/
│   │   ├── FileUpload.tsx        # PDF upload component
│   │   └── MarkdownDisplay.tsx   # Markdown display component
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Environment template
├── next.config.ts                # Next.js configuration
└── package.json                  # Dependencies
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LANGFLOW_BASE_URL` | Base URL of your Langflow instance | Yes |
| `LANGFLOW_API_TOKEN` | API authentication token | Yes |
| `LANGFLOW_FLOW_ID` | Flow ID for PDF conversion | Yes |
| `LANGFLOW_FILE_COMPONENT_NAME` | Name of File component in flow | Yes |

## API Endpoints

### POST /api/convert

Converts a PDF file to Markdown.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `{ file: PDF file, mode: "standard" | "vlm" }`

**Response:**
```json
{
  "success": true,
  "markdown": "# Converted content..."
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Technology Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **API Client**: [@datastax/langflow-client](www.npmjs.com/package/@datastax/langflow-client)
- **Runtime**: Node.js 20+

## File Validation

- **Allowed Types**: PDF only (`application/pdf`)
- **Maximum Size**: 10MB
- **Validation**: Both client-side and server-side

## Error Handling

The application handles various error scenarios:
- Invalid file type
- File size exceeds limit
- Network errors
- Langflow API failures
- Invalid credentials

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
