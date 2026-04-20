import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    'top-right': 'bottom-full right-0 mb-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#0A0A0B]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#0A0A0B]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#0A0A0B]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#0A0A0B]',
    'top-right': 'top-full right-4 border-t-[#0A0A0B]',
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div className={`absolute z-[200] animate-in fade-in zoom-in-95 duration-200 pointer-events-none ${positionClasses[position]}`}>
          <div className="bg-[#0A0A0B] text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
            {content}
          </div>
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
