import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

const UploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const allowedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && allowedFormats.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Unsupported file format. Please upload PDF, DOC, JPG, or PNG.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#edf6fd]">
      <h1 className="text-2xl font-bold text-[#56a8f5] absolute top-8 left-8">Hues Apply</h1>
      <div className="bg-white rounded-xl border-2 border-[#56a8f5] shadow-md p-10 w-[400px]">
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">Upload relevant document to<br />create your profile</h2>
        <div className="flex items-center mb-1">
          <div className="h-1 w-1/2 bg-blue-500 rounded-l-full"></div>
          <div className="h-1 w-1/2 bg-purple-300 rounded-r-full"></div>
        </div>
        <div className="flex justify-end mb-4">
          <span className="text-xs text-gray-500">Step 2/2</span>
        </div>
        <div className="relative bg-[#f0f6fd] border border-dashed border-gray-400 rounded-lg p-6 text-center h-40 flex flex-col items-center justify-center">
          <UploadCloud className="text-gray-500 mb-2" size={40} />
          <p className="text-sm font-medium text-gray-700">Drag & Drop Files</p>
          <p className="text-xs text-gray-500">Or click to browse your files</p>
          <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, JPG, PNG</p>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
          />
        </div>
        {file && <p className="mt-2 text-sm text-green-600">Selected file: {file.name}</p>}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button 
          className="mt-6 w-full bg-[#56a8f5] text-white font-medium py-2 rounded hover:bg-blue-600 transition"
          disabled={!file}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default UploadComponent;
