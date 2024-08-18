import React, { useState } from 'react';

interface Props {
  uploader: 'pdfUploader' | 'imageUploader' | 'docUploader' | 'profilePhotoUploader';
  onUploadSuccess?: (urls: string[], fileNames: string[]) => void;
  multiple?: boolean;
}

export const FileUploaderDropzoneWs = ({ uploader, onUploadSuccess, multiple = false }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }

    setLoading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      if (result.status === 'success') {
        const { urls, fileNames } = result;
        if (onUploadSuccess) {
          onUploadSuccess(urls, fileNames);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileUpload} 
        multiple={multiple} 
        disabled={loading}
      />
      {loading && <p>Uploading...</p>}
    </div>
  );
};
