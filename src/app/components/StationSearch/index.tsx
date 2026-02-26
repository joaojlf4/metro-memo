'use client';

import { useState, useRef, useEffect } from 'react';
import { sanitizeText } from '@/core/helpers';

type StationSearchProps = {
  stations: string[];
  onSelect: (station: string) => void;
  placeholder?: string;
  className?: string;
};

export function StationSearch({
  stations,
  onSelect,
  placeholder = 'Digite o nome da estação...',
  className = '',
}: StationSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar e ordenar estações baseado no input sanitizado
  const filteredStations = inputValue.trim()
    ? stations
        .filter((station) => {
          const sanitizedStation = sanitizeText(station);
          const sanitizedInput = sanitizeText(inputValue);
          return sanitizedStation.includes(sanitizedInput);
        })
        .sort((a, b) => {
          const sanitizedA = sanitizeText(a);
          const sanitizedB = sanitizeText(b);
          const sanitizedInput = sanitizeText(inputValue);

          // Prioridade 1: Começa com o termo digitado
          const aStartsWith = sanitizedA.startsWith(sanitizedInput);
          const bStartsWith = sanitizedB.startsWith(sanitizedInput);
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          // Prioridade 2: Alguma palavra começa com o termo digitado
          const aWordStarts = sanitizedA.split(/\s+/).some((word) => word.startsWith(sanitizedInput));
          const bWordStarts = sanitizedB.split(/\s+/).some((word) => word.startsWith(sanitizedInput));
          if (aWordStarts && !bWordStarts) return -1;
          if (!aWordStarts && bWordStarts) return 1;

          // Prioridade 3: Ordem alfabética
          return a.localeCompare(b);
        })
    : [];

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Resetar highlightedIndex quando as opções mudarem
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredStations.length]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsOpen(value.trim().length > 0);
    setHighlightedIndex(0);
  };

  const handleSelect = (station: string) => {
    setInputValue(station);
    setIsOpen(false);
    onSelect(station);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredStations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredStations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredStations[highlightedIndex]) {
          handleSelect(filteredStations[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => inputValue.trim().length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-800 bg-black text-white focus:outline-none focus:border-gray-600 transition-colors"
      />

      {isOpen && filteredStations.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto border-2 border-gray-800 bg-black z-50"
        >
          {filteredStations.map((station, index) => (
            <button
              key={`${station}-${index}`}
              onClick={() => handleSelect(station)}
              className={`w-full px-4 py-2 text-left cursor-pointer transition-colors border-b border-gray-800 last:border-b-0 ${
                index === highlightedIndex
                  ? 'bg-gray-800 text-white'
                  : 'hover:bg-gray-900 text-gray-300'
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {station}
            </button>
          ))}
        </div>
      )}

      {isOpen && inputValue.trim().length > 0 && filteredStations.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 border-2 border-gray-800 bg-black z-50"
        >
          <div className="px-4 py-3 text-gray-500 text-sm">
            Nenhuma estação encontrada
          </div>
        </div>
      )}
    </div>
  );
}
