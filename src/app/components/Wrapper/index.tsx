'use client';

import { ReactNode, useState, useEffect } from 'react';

type WrapperProps = {
  children: ReactNode;
  flashColor?: 'green' | 'red' | null;
};

export function Wrapper({ children, flashColor = null }: WrapperProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (flashColor) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [flashColor]);

  return (
    <div 
      className={`flex flex-col items-center gap-8 px-4 py-8 transition-colors duration-300 ${
        isFlashing && flashColor === 'green' ? 'bg-green-500/20' : 
        isFlashing && flashColor === 'red' ? 'bg-red-500/20' : 
        'bg-black'
      }`}
    >
      {children}
    </div>
  );
}
