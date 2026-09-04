import type { ReactNode } from 'react';

interface StartScreenProps {
  onStart: () => void;
  themeSelector: ReactNode;
}

export function StartScreen({ onStart, themeSelector }: StartScreenProps) {
  return (
    <main className="editorial-grid min-h-full bg-paper px-4 py-5 text-ink sm:px-8 sm:py-8">
      <div className="page-reveal mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-xl flex-col border-t-2 border-rule sm:min-h-[calc(100dvh-4rem)]">
        <header className="flex items-start justify-between gap-4 border-b border-rule py-3">
          <div className="font-mono text-[0.625rem] font-bold uppercase leading-4 text-muted">
            <p>Social edition</p>
            <p>5 × 5 / No. 001</p>
          </div>
          {themeSelector}
        </header>

        <section className="flex flex-1 flex-col justify-center py-10 sm:py-14">
          <p className="mb-4 font-mono text-[0.6875rem] font-bold uppercase text-muted">
            Find your people
          </p>
          <h1 className="text-6xl font-black uppercase leading-[0.82] sm:text-8xl">
            Bingo
            <br />
            Mixer
          </h1>

          <div className="mt-10 border-y border-rule sm:mt-14">
            <h2 className="border-b border-rule py-3 font-mono text-[0.6875rem] font-bold uppercase">
              How to play
            </h2>
            <ol className="text-sm font-semibold sm:text-base">
              <li className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-3 last:border-b-0">
                <span className="font-mono text-muted">01</span>
                <span>Find people who match the questions.</span>
              </li>
              <li className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-3 last:border-b-0">
                <span className="font-mono text-muted">02</span>
                <span>Tap a square when you find a match.</span>
              </li>
              <li className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-3 last:border-b-0">
                <span className="font-mono text-muted">03</span>
                <span>Get five in a row to win.</span>
              </li>
            </ol>
          </div>
        </section>

        <footer className="border-t-2 border-rule py-4">
          <button
            onClick={onStart}
            className="group flex min-h-14 w-full items-center justify-between bg-ink px-5 text-left text-sm font-black uppercase text-paper transition-colors hover:bg-muted focus-visible:outline-offset-2"
          >
            <span>Start game</span>
            <span className="font-mono text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </button>
        </footer>
      </div>
    </main>
  );
}
