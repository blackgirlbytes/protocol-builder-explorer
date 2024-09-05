import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProtocol } from '../context/ProtocolContext';
import JsonPreview from '../components/JsonPreview';

export default function DataTypes() {
  const { protocol, updateProtocol } = useProtocol();
  const [types, setTypes] = useState(protocol.types);
  const [currentType, setCurrentType] = useState({ name: '', schema: '', dataFormats: '' });
  const [previewData, setPreviewData] = useState({});
  const router = useRouter();

  useEffect(() => {
    setPreviewData({
      protocol: protocol.protocol,
      published: protocol.published,
      types,
    });
  }, [protocol.protocol, protocol.published, types]);

  const addType = () => {
    if (currentType.name && currentType.schema && currentType.dataFormats) {
      setTypes({
        ...types,
        [currentType.name]: {
          schema: currentType.schema,
          dataFormats: currentType.dataFormats.split(',').map(format => format.trim()),
        },
      });
      setCurrentType({ name: '', schema: '', dataFormats: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProtocol({ types });
    router.push('/next-step'); // Replace with your next step
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">What data types will your protocol support?</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="space-y-2 mb-4">
          <input
            type="text"
            value={currentType.name}
            onChange={(e) => setCurrentType({ ...currentType, name: e.target.value })}
            placeholder="Type Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={currentType.schema}
            onChange={(e) => setCurrentType({ ...currentType, schema: e.target.value })}
            placeholder="Schema URL"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={currentType.dataFormats}
            onChange={(e) => setCurrentType({ ...currentType, dataFormats: e.target.value })}
            placeholder="Data Formats (comma-separated)"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="space-x-2">
          <button 
            type="button" 
            onClick={addType}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Add Type
          </button>
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Next
          </button>
        </div>
      </form>
      <JsonPreview data={previewData} title="Protocol Preview" />
    </div>
  );
}