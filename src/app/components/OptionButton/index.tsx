'use client';

type OptionButtonProps = {
  station: string;
  onClick: () => void;
  disabled: boolean;
  isCorrect?: boolean;
  isSelected?: boolean;
  lineColor?: string;
  lineTextColor?: string;
};

export function OptionButton({
  station,
  onClick,
  disabled,
  isCorrect,
  isSelected,
  lineColor,
  lineTextColor,
}: OptionButtonProps) {
  let className = 'px-6 py-3 border-2 transition-colors text-left cursor-pointer';
  let style: React.CSSProperties = {};

  if (disabled) {
    if (isSelected && isCorrect) {
      // Acertou - cor da linha
      className += ' border-gray-800';
      style = {
        backgroundColor: lineColor,
        color: lineTextColor,
      };
    } else if (isSelected && !isCorrect) {
      // Errou - borda tracejada branca
      className += ' border-white border-3 border-dashed text-white';
    } else if (isCorrect) {
      // Mostrar a resposta certa quando errou - cor da linha
      className += ' border-gray-800';
      style = {
        backgroundColor: lineColor,
        color: lineTextColor,
      };
    } else {
      className += ' border-gray-300 text-gray-400';
    }
  } else {
    className += ' border-gray-300 hover:border-gray-500 cursor-pointer';
  }

  return (
    <button onClick={onClick} disabled={disabled} className={className} style={style}>
      {station}
    </button>
  );
}
