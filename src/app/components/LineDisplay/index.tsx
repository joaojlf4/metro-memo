'use client';

import { LINE_COLORS } from '@/core/constants/subway';

type LineDisplayProps = {
  lineName: string;
};

export function LineDisplay({ lineName }: LineDisplayProps) {
  const lineColor = LINE_COLORS[lineName];

  if (!lineColor) return null;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className="w-full max-w-md px-6 py-4 border-2 border-gray-800"
        style={{
          backgroundColor: lineColor.color,
          color: lineColor.textColor,
        }}
      >
        <p className="text-center text-lg font-medium">{lineName}</p>
      </div>
    </div>
  );
}
