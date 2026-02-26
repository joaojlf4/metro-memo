'use client';

import { Wrapper } from '../Wrapper';

type MainMenuProps = {
  onSelectMode: (mode: 'quiz' | 'explorer' | 'order-quiz') => void;
};

export function MainMenu({ onSelectMode }: MainMenuProps) {
  return (
    <Wrapper>
      <h1 className="text-3xl font-medium">Metrô de São Paulo</h1>
      <p className="text-gray-300 text-center max-w-md">
        Memorize todas as linhas, estações e baldeações do metrô de SP
      </p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => onSelectMode('explorer')}
          className="px-6 py-4 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors font-medium cursor-pointer"
        >
          Explorar Linhas e Estações
        </button>

        <button
          onClick={() => onSelectMode('quiz')}
          className="px-6 py-4 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors font-medium cursor-pointer"
        >
          Quiz: Qual estação?
        </button>

        <button
          onClick={() => onSelectMode('order-quiz')}
          className="px-6 py-4 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors font-medium cursor-pointer"
        >
          Quiz: Ordem das estações
        </button>
      </div>
    </Wrapper>
  );
}
