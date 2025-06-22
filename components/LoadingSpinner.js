import React from "react";

const LoadingSpinner = () => {
  return (
    <>
      {/* Desktop version - centered */}
      <div className="hidden sm:flex sm:justify-center sm:items-center sm:min-h-screen">
        <div className="breeding-rhombus-spinner">
          <div className="rhombus child-1"></div>
          <div className="rhombus child-2"></div>
          <div className="rhombus child-3"></div>
          <div className="rhombus child-4"></div>
          <div className="rhombus child-5"></div>
          <div className="rhombus child-6"></div>
          <div className="rhombus child-7"></div>
          <div className="rhombus child-8"></div>
          <div className="rhombus big"></div>
        </div>
      </div>
      
      {/* Small screen version - positioned */}
      <div className="block sm:hidden">
        <div className="breeding-rhombus-spinner" style={{ position: 'absolute', top: '40vw', left: '40vw' }}>
          <div className="rhombus child-1"></div>
          <div className="rhombus child-2"></div>
          <div className="rhombus child-3"></div>
          <div className="rhombus child-4"></div>
          <div className="rhombus child-5"></div>
          <div className="rhombus child-6"></div>
          <div className="rhombus child-7"></div>
          <div className="rhombus child-8"></div>
          <div className="rhombus big"></div>
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
