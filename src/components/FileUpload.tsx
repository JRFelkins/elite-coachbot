import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const content = reader.result as string;
        onFileUpload(content);
      };
      reader.readAsText(file);
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/jsonl': ['.jsonl'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-white/20 hover:border-blue-500/50 hover:bg-white/5'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 mx-auto mb-2 text-blue-400" />
      <p className="text-blue-200">
        {isDragActive
          ? 'Drop your knowledge base file here'
          : 'Drag & drop your JSONL or TXT file here, or click to select'}
      </p>
      <p className="text-sm text-blue-200/60 mt-2">
        Supported formats: .jsonl, .txt
      </p>
    </div>
  );
};

export default FileUpload;