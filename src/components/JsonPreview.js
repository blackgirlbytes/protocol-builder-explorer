import React, { useState } from 'react';

const JsonPreview = ({ data, title = "Preview" }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
  };

  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={copyToClipboard}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {copySuccess || 'Copy'}
        </button>
      </div>
      <pre className="bg-white p-4 rounded-lg overflow-x-auto border border-gray-200">
        <code className="text-sm">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
};

export default JsonPreview;