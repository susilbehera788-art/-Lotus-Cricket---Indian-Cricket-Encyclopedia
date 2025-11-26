import React from 'react';

interface AdProps {
  size: 'leaderboard' | 'rectangle' | 'sidebar';
  className?: string;
}

const AdPlaceholder: React.FC<AdProps> = ({ size, className = '' }) => {
  let dimensions = '';
  let label = '';

  switch (size) {
    case 'leaderboard':
      dimensions = 'w-full h-24 max-w-[728px]';
      label = 'Ad Space (728x90)';
      break;
    case 'rectangle':
      dimensions = 'w-[300px] h-[250px]';
      label = 'Ad Space (300x250)';
      break;
    case 'sidebar':
      dimensions = 'w-full h-[600px]';
      label = 'Ad Space (Sidebar)';
      break;
  }

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto my-4 ${dimensions} ${className}`}>
      <div className="text-center">
        <p className="text-gray-400 font-semibold text-sm">Google AdSense</p>
        <p className="text-gray-400 text-xs">{label}</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;