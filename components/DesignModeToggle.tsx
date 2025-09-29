import React, { type FC } from 'react';
import { PencilIcon, XIcon } from './IconComponents';
import { useDesignMode } from '../contexts/DesignModeContext';

const DesignModeToggle: FC = () => {
  const { isDesignMode, toggleDesignMode } = useDesignMode();

  return (
    <button
      onClick={toggleDesignMode}
      className={`fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ease-in-out
        ${isDesignMode 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-emerald-500 hover:bg-emerald-600'
        }
      `}
      title={isDesignMode ? "Exit Design Mode" : "Enter Design Mode"}
    >
      {isDesignMode ? (
        <XIcon className="h-7 w-7" />
      ) : (
        <PencilIcon className="h-7 w-7" />
      )}
    </button>
  );
};

export default DesignModeToggle;
