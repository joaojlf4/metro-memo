'use client';

type FeedbackMessageProps = {
  isCorrect: boolean | null;
};

export function FeedbackMessage({ isCorrect }: FeedbackMessageProps) {
  if (isCorrect === null) return null;

  return (
    <div className="text-center py-2">
      <p className={`text-lg font-medium ${isCorrect ? 'text-green-500' : 'text-red-800'}`}>
        {isCorrect ? '✓ Correto!' : '✗ Incorreto!'}
      </p>
    </div>
  );
}
