'use client';

import { QuizScore } from '@/core/types';

type ScoreDisplayProps = {
  score: QuizScore;
};

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="flex gap-6 text-sm">
      <div className="flex gap-2">
        <span className="font-medium">Corretas:</span>
        <span>{score.correct}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-medium">Erradas:</span>
        <span>{score.wrong}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-medium">Total:</span>
        <span>{score.total}</span>
      </div>
    </div>
  );
}
