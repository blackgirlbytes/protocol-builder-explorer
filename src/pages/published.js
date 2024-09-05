import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProtocol } from '@/context/ProtocolContext';
import JsonPreview from '@/components/JsonPreview';

export default function Published() {
  const { protocol, updateProtocol } = useProtocol();
  const [isPublished, setIsPublished] = useState(protocol.published);
  const [previewData, setPreviewData] = useState({});
  const router = useRouter();

  useEffect(() => {
    setPreviewData({ published: isPublished });
  }, [isPublished]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProtocol({ published: isPublished });
    router.push('/protocol-uri');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Do you want your protocol to be public?</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center space-x-4 mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="published"
              value="true"
              checked={isPublished}
              onChange={() => setIsPublished(true)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="published"
              value="false"
              checked={!isPublished}
              onChange={() => setIsPublished(false)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Next
        </button>
      </form>
      <JsonPreview data={previewData} title="Published Status Preview" />
    </div>
  );
}