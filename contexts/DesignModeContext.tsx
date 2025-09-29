import React, { createContext, useState, useContext, useEffect, useCallback, type FC } from 'react';
import { useToast } from './ToastContext';

interface DesignModeContextType {
  isDesignMode: boolean;
  toggleDesignMode: () => void;
}

const DesignModeContext = createContext<DesignModeContextType | undefined>(undefined);

export const useDesignMode = () => {
  const context = useContext(DesignModeContext);
  if (!context) {
    throw new Error('useDesignMode must be used within a DesignModeProvider');
  }
  return context;
};

export const DesignModeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDesignMode, setIsDesignMode] = useState(false);
  const { addToast } = useToast();

  const toggleDesignMode = useCallback(() => {
    setIsDesignMode(prev => !prev);
  }, []);

  useEffect(() => {
    const handleDesignModeClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const designElement = target.closest('[data-design-id]');
      
      if (designElement) {
        event.preventDefault();
        event.stopPropagation();
        const designId = designElement.getAttribute('data-design-id');
        if (designId) {
            navigator.clipboard.writeText(designId).then(() => {
                addToast(`ID "${designId}" copied!`);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                addToast(`Error copying ID.`);
            });
        }
      }
    };

    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    if (isDesignMode) {
      document.body.classList.add('design-mode-active');
      styleElement.innerHTML = `
        .design-mode-active [data-design-id] {
          position: relative;
          outline: 1px dashed rgba(244, 63, 94, 0.4); /* red-500 with opacity */
          cursor: copy !important;
        }
        .design-mode-active [data-design-id]::after {
          content: attr(data-design-id);
          position: absolute;
          top: 0;
          left: 0;
          background-color: #f43f5e; /* red-500 */
          color: white;
          padding: 2px 6px;
          font-size: 10px;
          font-family: monospace;
          font-weight: bold;
          border-radius: 4px;
          z-index: 1000;
          pointer-events: none; /* so it doesn't interfere with clicks */
          transform: translate(-5px, -50%);
          opacity: 0.9;
          white-space: nowrap;
          transition: opacity 0.2s, transform 0.2s;
        }
        .design-mode-active [data-design-id]:hover {
          outline: 2px solid #f43f5e;
          box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.3);
        }
         .design-mode-active [data-design-id]:hover::after {
            opacity: 1;
            transform: translate(-5px, -50%) scale(1.05);
        }
      `;
      window.addEventListener('click', handleDesignModeClick, true);
    }

    return () => {
      document.body.classList.remove('design-mode-active');
      window.removeEventListener('click', handleDesignModeClick, true);
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [isDesignMode, addToast]);

  return (
    <DesignModeContext.Provider value={{ isDesignMode, toggleDesignMode }}>
      {children}
    </DesignModeContext.Provider>
  );
};