import React from "react";

const Loader = ({ show, size = 80, color = "#FBBF24" }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-xs"></div>

      
      <svg
        className="animate-spin relative z-10"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        role="status"
        aria-label="Loading"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="90,150"
        />
      </svg>
    </div>
  );
};

export default Loader;
