'use client';

import { useState, useEffect } from 'react';
import { SubwayData, QuizQuestion, QuizScore } from '@/core/types';
import { generateQuizQuestion } from '@/core/helpers';
import { LINE_COLORS } from '@/core/constants/subway';
import { LineDisplay } from '../LineDisplay';
import { OptionButton } from '../OptionButton';
import { FeedbackMessage } from '../FeedbackMessage';
import { ScoreDisplay } from '../ScoreDisplay';
import { HintModal } from '../HintModal';
import { BackButton } from '../BackButton';
import { Wrapper } from '../Wrapper';

type QuizGameProps = {
  subwayData: SubwayData;
  numberOfOptions: number;
  onExit: () => void;
};

export function QuizGame({ subwayData, numberOfOptions, onExit }: QuizGameProps) {
  const [question, setQuestion] = useState<QuizQuestion>(() =>
    generateQuizQuestion(subwayData, numberOfOptions)
  );
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [score, setScore] = useState<QuizScore>({
    correct: 0,
    wrong: 0,
    total: 0,
  });
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null);

  // Suporte a teclas numéricas
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedStation !== null || isHintModalOpen) return;

      const num = parseInt(e.key);
      if (num >= 1 && num <= question.options.length) {
        handleAnswer(question.options[num - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [question.options, selectedStation, isHintModalOpen]);

  const handleAnswer = (station: string) => {
    if (selectedStation !== null) return;

    setSelectedStation(station);
    const isCorrect = station === question.correctStation;

    // Flash de feedback
    setFlashColor(isCorrect ? 'green' : 'red');
    setTimeout(() => setFlashColor(null), 300);

    setScore((prev: QuizScore) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    setSelectedStation(null);
    setQuestion(generateQuizQuestion(subwayData, numberOfOptions));
  };

  const isAnswered = selectedStation !== null;
  const isCorrect = isAnswered ? selectedStation === question.correctStation : null;
  const lineColor = LINE_COLORS[question.line];

  return (
    <Wrapper flashColor={flashColor}>
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
        
        <LineDisplay lineName={question.line} />

        <p className="text-center text-lg font-medium">
          Qual estação pertence a esta linha?
        </p>

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

        <FeedbackMessage isCorrect={isCorrect} />

        {isAnswered && (
          <button
            onClick={handleNext}
            className="cursor-pointer px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors font-medium"
          >
            Próxima Pergunta
          </button>
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
