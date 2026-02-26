'use client';

import { QuizSettings } from '@/core/types';
import { Wrapper } from '../Wrapper';

type QuizSetupProps = {
  settings: QuizSettings;
  onSettingsChange: (settings: QuizSettings) => void;
  onStart: () => void;
};

export function QuizSetup({ settings, onSettingsChange, onStart }: QuizSetupProps) {
  const options = [3, 4, 5, 6] as const;

  return (
    <Wrapper>
      <h1 className="text-2xl font-medium">Quiz: Qual estação?</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Número de opções:</span>
          <div className="flex gap-2">
            {options.map((num, index) => (
              <button
                key={index}
                onClick={() =>
                  onSettingsChange({ ...settings, numberOfOptions: num })
                }
                className={`cursor-pointer w-full px-4 py-2 border-2 border-gray-300 ${
                  settings.numberOfOptions === num
                    ? 'bg-gray-300 text-black'
                    : ' hover:border-gray-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </label>

        <button
          onClick={onStart}
          className="cursor-pointer px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors font-medium"
        >
          Começar Quiz
        </button>
      </div>
    </Wrapper>
  );
}
