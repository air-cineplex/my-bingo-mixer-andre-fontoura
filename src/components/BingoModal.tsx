interface BingoModalProps {
  onDismiss: () => void;
}

export function BingoModal({ onDismiss }: BingoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
      <div
        className="modal-reveal w-full max-w-md border-2 border-rule bg-paper p-5 text-ink shadow-[10px_10px_0_var(--ink)] sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bingo-title"
        aria-describedby="bingo-description"
      >
        <div className="flex justify-between border-b border-rule pb-3 font-mono text-[0.625rem] font-bold uppercase text-muted">
          <span>Result / 01</span>
          <span>Line complete</span>
        </div>
        <h2 id="bingo-title" className="my-8 text-center text-6xl font-black uppercase leading-none sm:text-8xl">
          Bingo
        </h2>
        <p id="bingo-description" className="border-y border-rule py-4 text-center text-sm font-semibold uppercase">
          You completed a line.
        </p>

        <button
          onClick={onDismiss}
          autoFocus
          className="mt-5 min-h-12 w-full bg-ink px-5 text-sm font-black uppercase text-paper transition-colors hover:bg-muted"
        >
          Keep playing
        </button>
      </div>
    </div>
  );
}
