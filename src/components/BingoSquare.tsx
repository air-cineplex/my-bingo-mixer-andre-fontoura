import type { BingoSquareData } from '../types';

interface BingoSquareProps {
  square: BingoSquareData;
  isWinning: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinning, onClick }: BingoSquareProps) {
  const baseClasses =
    'relative flex min-h-0 items-center justify-center overflow-hidden p-1 text-center font-semibold select-none transition-colors sm:p-2';

  const stateClasses = square.isMarked
    ? isWinning
      ? 'winning-square text-ink'
      : square.isFreeSpace
        ? 'bg-soft text-ink'
        : 'bg-ink text-paper'
    : 'bg-paper text-ink hover:bg-soft active:bg-soft';

  const freeSpaceClasses = square.isFreeSpace
    ? 'font-mono font-black uppercase'
    : '';

  const textClasses = square.isFreeSpace
    ? 'text-[0.625rem] leading-tight sm:text-sm'
    : 'text-[0.5625rem] leading-[1.15] sm:text-xs sm:leading-tight';

  return (
    <button
      onClick={onClick}
      disabled={square.isFreeSpace}
      className={`${baseClasses} ${stateClasses} ${freeSpaceClasses}`}
      aria-pressed={square.isMarked}
      aria-label={square.isFreeSpace ? 'Free space' : square.text}
    >
      <span className={`wrap-break-word hyphens-auto ${textClasses}`}>{square.text}</span>
      {square.isMarked && !square.isFreeSpace && (
        <span
          className={`absolute right-1 top-0.5 font-mono text-[0.5rem] font-black sm:top-1 sm:text-[0.625rem] ${isWinning ? 'text-ink' : 'text-paper'}`}
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </button>
  );
}
