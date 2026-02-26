'use client';

import { useState, useEffect } from 'react';
import { SubwayData, StationQuizQuestion, QuizScore } from '@/core/types';
import { generateStationQuizQuestion } from '@/core/helpers';
import { LINE_COLORS } from '@/core/constants/subway';
import { HintModal } from '../HintModal';
import { ScoreDisplay } from '../ScoreDisplay';
import { BackButton } from '../BackButton';
import { Wrapper } from '../Wrapper';

type StationQuizGameProps = {
  subwayData: SubwayData;
  numberOfOptions: number;
  onExit: () => void;
};

export function StationQuizGame({
  subwayData,
  numberOfOptions,
  onExit,
}: StationQuizGameProps) {
  const [question, setQuestion] = useState<StationQuizQuestion>(
    () => generateStationQuizQuestion(subwayData, numberOfOptions)
  );
  const [selectedLines, setSelectedLines] = useState<Set<string>>(new Set());
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState<QuizScore>({ correct: 0, wrong: 0, total: 0 });
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

  const handleLineToggle = (line: string) => {
    if (isAnswered) return;

    const newSelected = new Set(selectedLines);
    if (newSelected.has(line)) {
      newSelected.delete(line);
    } else {
      newSelected.add(line);
    }
    setSelectedLines(newSelected);
  };

  const handleConfirm = () => {
    if (selectedLines.size === 0 || isAnswered) return;

    setIsAnswered(true);

    // Verificar se a resposta está correta
    const selectedArray = Array.from(selectedLines).sort();
    const correctArray = question.correctLines.sort();
    const isCorrect =
      selectedArray.length === correctArray.length &&
      selectedArray.every((line, index) => line === correctArray[index]);

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    setQuestion(generateStationQuizQuestion(subwayData, numberOfOptions));
    setSelectedLines(new Set());
    setIsAnswered(false);
  };

  const getLineStatus = (line: string) => {
    if (!isAnswered) return 'default';
    
    const isSelected = selectedLines.has(line);
    const isCorrect = question.correctLines.includes(line);

    if (isCorrect && isSelected) return 'correct';
    if (isCorrect && !isSelected) return 'missed';
    if (!isCorrect && isSelected) return 'wrong';
    return 'default';
  };

  return (
    <Wrapper>
      <div className="flex justify-between items-center w-full max-w-2xl">
        <BackButton onClick={onExit} />
        <ScoreDisplay score={score} />
      </div>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <button
          onClick={() => setIsHintModalOpen(true)}
          className="cursor-pointer px-4 py-2 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors font-medium self-center"
        >
          💡 Dica
        </button>

        <div className="border-2 border-gray-800 p-6 text-center">
          <p className="text-sm text-gray-300 mb-2">Quais linhas passam por esta estação?</p>
          <h2 className="text-3xl font-medium">{question.station}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((line) => {
            const lineColor = LINE_COLORS[line];
            const status = getLineStatus(line);
            const isSelected = selectedLines.has(line);

            let borderColor = 'border-gray-800';
            let backgroundColor = '';
            let textColor = 'text-white';

            if (status === 'correct') {
              borderColor = 'border-green-500';
              backgroundColor = 'bg-green-500';
            } else if (status === 'wrong') {
              borderColor = 'border-red-800';
              backgroundColor = 'bg-red-800';
            } else if (status === 'missed') {
              borderColor = 'border-green-500';
              backgroundColor = '';
            } else if (isSelected) {
              backgroundColor = lineColor?.color ? '' : 'bg-gray-700';
              borderColor = 'border-gray-300';
            }

            return (
              <button
                key={line}
                onClick={() => handleLineToggle(line)}
                disabled={isAnswered}
                className={`cursor-pointer px-4 py-3 border-2 ${borderColor} ${backgroundColor} ${textColor} transition-colors font-medium ${
                  !isAnswered && 'hover:border-gray-400'
                } ${isAnswered && 'opacity-75'}`}
                style={{
                  backgroundColor:
                    isSelected && !isAnswered && lineColor?.color
                      ? lineColor.color
                      : backgroundColor || undefined,
                  color:
                    isSelected && !isAnswered && lineColor?.textColor
                      ? lineColor.textColor
                      : status === 'correct' || status === 'wrong'
                      ? 'white'
                      : 'white',
                  borderLeftWidth: '8px',
                  borderLeftColor: lineColor?.color || borderColor,
                }}
              >
                {line}
              </button>
            );
          })}
        </div>

        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={selectedLines.size === 0}
            className={`cursor-pointer px-6 py-3 border-2 border-gray-800 font-medium transition-colors ${
              selectedLines.size === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            Confirmar
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="border-2 border-gray-800 p-4 text-center">
              <p className="text-sm text-gray-300 mb-1">Linhas corretas:</p>
              <p className="font-medium">
                {question.correctLines.join(', ')}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="cursor-pointer px-6 py-3 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors font-medium"
            >
              Próxima →
            </button>
          </div>
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
