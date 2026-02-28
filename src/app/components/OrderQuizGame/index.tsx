'use client';

import { useState, useRef, useEffect } from 'react';
import { SubwayData, OrderQuizQuestion, OrderQuizPath, QuizSettings } from '@/core/types';
import { generateOrderQuizQuestion } from '@/core/helpers';
import { LINE_COLORS } from '@/core/constants/subway';
import { LineDisplay } from '../LineDisplay';
import { OptionButton } from '../OptionButton';
import { HintModal } from '../HintModal';
import { BackButton } from '../BackButton';
import { Wrapper } from '../Wrapper';
import { StationSearch } from '../StationSearch';

type OrderQuizGameProps = {
  subwayData: SubwayData;
  lineName: string;
  numberOfOptions: number;
  onExit: () => void;
};

export function OrderQuizGame({ subwayData, lineName, numberOfOptions, onExit }: OrderQuizGameProps) {
  const totalStations = subwayData[lineName].length;
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  
  const [currentPosition, setCurrentPosition] = useState(0);
  const [question, setQuestion] = useState<OrderQuizQuestion>(() =>
    generateOrderQuizQuestion(subwayData, lineName, 0, numberOfOptions)
  );
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [path, setPath] = useState<OrderQuizPath>([]);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mode, setMode] = useState<'input' | 'options'>('input');
  const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Auto-scroll para o final do breadcrumb quando path mudar
  useEffect(() => {
    if (breadcrumbRef.current) {
      breadcrumbRef.current.scrollLeft = breadcrumbRef.current.scrollWidth;
    }
  }, [path]);

  // Suporte a teclas numéricas (somente no modo options)
  useEffect(() => {
    if (mode !== 'options' || isHintModalOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedStation !== null) return;

      const num = parseInt(e.key);
      if (num >= 1 && num <= question.options.length) {
        handleAnswer(question.options[num - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mode, question.options, selectedStation, isHintModalOpen]);

  const handleAnswer = (station: string) => {
    if (selectedStation !== null) return;

    setSelectedStation(station);
    const isCorrect = station === question.correctStation;

    // Flash de feedback
    setFlashColor(isCorrect ? 'green' : 'red');
    setTimeout(() => setFlashColor(null), 300);

    if (isCorrect) {
      // Adicionar ao caminho quando acerta
      setPath((prev) => [...prev, { station: question.correctStation, isCorrect: true }]);
      
      // Avança para a próxima
      setTimeout(() => {
        handleNext();
      }, mode === 'input' ? 300 : 0);
    } else {
      // Se errou, reinicia do zero
      setTimeout(() => {
        handleRestart();
      }, mode === 'input' ? 300 : 1000);
    }
  };

  const handleNext = () => {
    const newPosition = currentPosition + 1;
    
    if (newPosition >= totalStations) {
      setIsFinished(true);
      return;
    }

    setCurrentPosition(newPosition);
    setSelectedStation(null);
    setQuestion(generateOrderQuizQuestion(subwayData, lineName, newPosition, numberOfOptions));
    
    // Trigger para limpar e focar input no modo input
    if (mode === 'input') {
      setClearTrigger(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentPosition(0);
    setSelectedStation(null);
    setPath([]);
    setIsFinished(false);
    setQuestion(generateOrderQuizQuestion(subwayData, lineName, 0, numberOfOptions));
    setClearTrigger(prev => prev + 1);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'input' ? 'options' : 'input'));
  };

  const isAnswered = selectedStation !== null;
  const isCorrect = isAnswered ? selectedStation === question.correctStation : null;
  const lineColor = LINE_COLORS[question.line];

  const correctCount = path.filter((p) => p.isCorrect).length;
  const wrongCount = path.filter((p) => !p.isCorrect).length;

  // Pegar todas as estações da linha atual para o StationSearch
  const allStationsInLine = subwayData[lineName];

  if (isFinished) {
    return (
      <Wrapper flashColor={flashColor}>
        <h2 className="text-2xl font-medium">Quiz Concluído!</h2>
        
        <div className="border-2 border-gray-800 p-6 w-full max-w-2xl">
          <LineDisplay lineName={lineName} />
          
          <div className="mt-6 text-center">
            <p className="text-lg mb-2">
              <span className="text-green-500 font-medium">Corretas: {correctCount}</span>
              {' / '}
              <span className="text-red-800 font-medium">Erradas: {wrongCount}</span>
            </p>
            <p className="text-gray-600">Total: {totalStations} estações</p>
          </div>

          {/* Breadcrumb do caminho completo */}
          <div className="mt-6 overflow-x-auto">
            <div className="flex gap-2 justify-center min-w-max">
              {path.map((item, index) => (
                <span key={index} className="whitespace-nowrap">
                  <span className={item.isCorrect ? 'text-green-500' : 'text-red-800'}>
                    {item.station}
                  </span>
                  {index < path.length - 1 && <span className="text-gray-400 mx-1">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRestart}
            className="cursor-pointer px-6 py-3 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors font-medium"
          >
            Jogar Novamente
          </button>
          <button
            onClick={onExit}
            className="cursor-pointer px-6 py-3 border-2 border-gray-300 hover:border-gray-400 transition-colors"
          >
            Voltar ao Menu
          </button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper flashColor={flashColor}>
      <div className="flex justify-between items-center w-full max-w-2xl">
        <BackButton onClick={onExit} />
        <div className="flex gap-6 text-sm">
          <div className="flex gap-2">
            <span className="font-medium">Corretas:</span>
            <span className="text-green-500">{correctCount}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Erradas:</span>
            <span className="text-red-800">{wrongCount}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {currentPosition + 1}/{totalStations}
        </div>
      </div>

      {/* Breadcrumb do caminho atual */}
      {path.length > 0 && (
        <div className="w-full max-w-2xl border-2 border-gray-300 p-4">
          <p className="text-xs text-gray-600 mb-2">Caminho percorrido:</p>
          <div ref={breadcrumbRef} className="overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {path.map((item, index) => (
                <span key={index} className="whitespace-nowrap">
                  <span className={item.isCorrect ? 'text-green-500' : 'text-red-800'}>
                    {item.station}
                  </span>
                  {index < path.length - 1 && <span className="text-gray-400 mx-1">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <button
          onClick={() => setIsHintModalOpen(true)}
          className="cursor-pointer px-4 py-2 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors font-medium self-center"
        >
          💡 Dica
        </button>
        
        <LineDisplay lineName={question.line} />

        <p className="text-center text-lg font-medium">
          Qual é a próxima estação?
        </p>

        <button
          onClick={toggleMode}
          className="text-sm text-gray-400 hover:text-gray-300 underline cursor-pointer self-center transition-colors"
        >
          {mode === 'input' ? 'Trocar para opções' : 'Trocar para digitação'}
        </button>

        {mode === 'input' ? (
          <div className="flex flex-col gap-4">
            <StationSearch
              key={`${currentPosition}-${clearTrigger}`}
              stations={allStationsInLine}
              onSelect={handleAnswer}
              placeholder="Digite o nome da próxima estação..."
              autoFocus={true}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((station: string, index: number) => (
                <OptionButton
                  key={station}
                  station={`${index + 1}. ${station}`}
                  onClick={() => handleAnswer(station)}
                  disabled={isAnswered}
                  isCorrect={station === question.correctStation}
                  isSelected={station === selectedStation}
                  lineColor={lineColor?.color}
                  lineTextColor={lineColor?.textColor}
                />
              ))}
            </div>

            {isAnswered && !isCorrect && (
              <div className="text-center text-lg font-medium text-red-800">
                ✗ Recomeçando...
              </div>
            )}
          </>
        )}
      </div>

      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        maxSeconds={numberOfOptions}
      />
    </Wrapper>
  );
}
