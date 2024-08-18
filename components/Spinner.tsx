// Spinner.tsx
import React from 'react';

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="w-24 h-24 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default Spinner;
