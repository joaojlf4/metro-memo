'use client';

import { useEffect, useState } from 'react';

type HintModalProps = {
  isOpen: boolean;
  onClose: () => void;
  maxSeconds?: number;
};

export function HintModal({ isOpen, onClose, maxSeconds }: HintModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(maxSeconds);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(maxSeconds);
      return;
    }

    if (!maxSeconds) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === undefined || prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, maxSeconds, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-black border-4 border-gray-400 max-w-4xl max-h-[90vh] overflow-auto">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center border-2 border-gray-800 bg-gray-800 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer text-xl font-bold"
        >
          ×
        </button>

        {/* Contador */}
        {maxSeconds && secondsLeft !== undefined && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-gray-800 border-2 border-gray-800 text-sm font-medium">
            {secondsLeft}s
          </div>
        )}

        {/* Imagem */}
        <img
          src="/dica.webp"
          alt="Dica do metrô"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
