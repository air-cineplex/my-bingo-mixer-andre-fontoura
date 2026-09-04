import type { ReactNode } from 'react';
import type { BingoSquareData } from '../types';
import { BingoBoard } from './BingoBoard';

interface GameScreenProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  hasBingo: boolean;
  onSquareClick: (squareId: number) => void;
  onReset: () => void;
  themeSelector: ReactNode;
}

export function GameScreen({
  board,
  winningSquareIds,
  hasBingo,
  onSquareClick,
  onReset,
  themeSelector,
}: GameScreenProps) {
  return (
    <main className="editorial-grid min-h-full bg-paper px-4 py-4 text-ink sm:px-8 sm:py-6">
      <div className="page-reveal mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col sm:min-h-[calc(100dvh-3rem)]">
        <header className="grid grid-cols-[auto_1fr] items-center gap-3 border-y-2 border-rule py-3 sm:grid-cols-[1fr_auto_1fr]">
          <button
            onClick={onReset}
            className="flex size-10 items-center justify-center border border-rule bg-paper font-mono text-lg transition-colors hover:bg-ink hover:text-paper"
            aria-label="Back to start"
            title="Back to start"
          >
            ←
          </button>
          <div className="text-right sm:order-3">{themeSelector}</div>
          <div className="col-span-2 border-t border-rule pt-3 sm:order-2 sm:col-span-1 sm:border-0 sm:pt-0 sm:text-center">
            <p className="text-xl font-black uppercase leading-none">Bingo Mixer</p>
            <p className="mt-1 font-mono text-[0.625rem] font-bold uppercase text-muted">Live board / 5 × 5</p>
          </div>
        </header>

        <div className="flex items-center justify-between gap-4 border-b border-rule py-3 font-mono text-[0.625rem] font-bold uppercase text-muted">
          <p>Tap a matching square</p>
          <p aria-live="polite">{hasBingo ? 'Line complete' : 'In progress'}</p>
        </div>

        {hasBingo && (
          <div className="border-b-2 border-rule bg-ink py-2 text-center font-mono text-xs font-bold uppercase text-paper">
            Bingo / You completed a line
          </div>
        )}

        <div className="flex flex-1 items-center justify-center py-4 sm:py-6">
        <BingoBoard
          board={board}
          winningSquareIds={winningSquareIds}
          onSquareClick={onSquareClick}
        />
        </div>

        <footer className="flex justify-between border-t border-rule py-3 font-mono text-[0.625rem] font-bold uppercase text-muted">
          <span>25 prompts</span>
          <span>Five makes a line</span>
        </footer>
      </div>
    </main>
  );
}
