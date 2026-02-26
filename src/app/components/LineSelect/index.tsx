'use client';

import { SubwayData } from '@/core/types';
import { LINE_COLORS } from '@/core/constants/subway';
import { BackButton } from '../BackButton';
import { Wrapper } from '../Wrapper';

type LineSelectProps = {
  subwayData: SubwayData;
  onSelectLine: (lineName: string) => void;
  onExit: () => void;
};

export function LineSelect({ subwayData, onSelectLine, onExit }: LineSelectProps) {
  return (
    <Wrapper>
      <div className="flex gap-2 items-center w-full max-w-2xl">
        <BackButton onClick={onExit} />
        <h2 className="text-lg font-medium">Selecione uma Linha</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {Object.keys(subwayData).map((lineName) => {
          const lineColor = LINE_COLORS[lineName];
          return (
            <button
              key={lineName}
              onClick={() => onSelectLine(lineName)}
              className="px-6 py-4 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer text-left"
              style={{
                borderLeft: `8px solid ${lineColor?.color || '#000'}`,
              }}
            >
              <div className="font-medium">{lineName}</div>
              <div className="text-sm text-gray-400 mt-1">
                {subwayData[lineName].length} estações
              </div>
            </button>
          );
        })}
      </div>
    </Wrapper>
  );
}
