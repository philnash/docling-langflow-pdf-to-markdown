'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import MarkdownDisplay from './components/MarkdownDisplay';

export default function Home() {
  const [markdown, setMarkdown] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleUpload = async (file: File, mode: 'standard' | 'vlm') => {
    setIsUploading(true);
    setError('');
    setMarkdown('');
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMarkdown(data.markdown);
      } else {
        setError(data.error || 'Conversion failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setMarkdown('');
    setError('');
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PDF to Markdown Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload a PDF file and convert it to Markdown format using Langflow
          </p>
        </div>

        <div className="space-y-8">
          {!markdown && (
            <FileUpload onUpload={handleUpload} isUploading={isUploading} />
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Conversion Error
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {markdown && (
            <>
              <MarkdownDisplay markdown={markdown} fileName={fileName} />
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Convert Another File
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
