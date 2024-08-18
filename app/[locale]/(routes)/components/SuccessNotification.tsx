'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SuccessNotificationProps {
  onClose: () => void;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ onClose }) => {
  const router = useRouter();

  const handleCloseAndRedirect = () => {
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Success!</h2>
        <p>Your email has been sent successfully.</p>
        <button
          onClick={handleCloseAndRedirect}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;
