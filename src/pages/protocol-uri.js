import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProtocol } from '../context/ProtocolContext';
import JsonPreview from '../components/JsonPreview';

export default function ProtocolURI() {
  const { protocol, updateProtocol } = useProtocol();
  const [uri, setUri] = useState(protocol.protocol);
  const [previewData, setPreviewData] = useState({});
  const router = useRouter();

  useEffect(() => {
    setPreviewData({
      protocol: uri,
      published: protocol.published,
    });
  }, [uri, protocol.published]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProtocol({ protocol: uri });
    router.push('/data-types');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">What do you want the protocol URI to be?</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          placeholder="https://example.com/your-protocol"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button 
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </form>
      <JsonPreview 
        data={previewData}
        title="Protocol Preview"
      />
    </div>
  );
}