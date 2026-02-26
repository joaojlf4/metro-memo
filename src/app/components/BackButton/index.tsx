type BackButtonProps = {
  onClick: () => void;
};

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer px-2 py-1 border-2 border-gray-300 hover:border-gray-400 transition-colors"
    >
      ←
    </button>
  );
}
