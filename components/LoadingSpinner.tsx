import React from 'react';
const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-screen h-screen bg-slate-900 text-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-14 h-14 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
          Loading
        </span>
      </div>
      <p className="text-sm text-slate-400">Fetching latest incidents...</p>
    </div>
  </div>
);
export default LoadingSpinner;