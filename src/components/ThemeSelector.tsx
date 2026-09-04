import type { ThemeMode } from '../hooks/useTheme';

interface ThemeSelectorProps {
  value: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

const themeOptions: { label: string; value: ThemeMode }[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div
      className="inline-grid grid-cols-3 border border-rule bg-paper font-mono text-[0.625rem] font-bold uppercase"
      role="radiogroup"
      aria-label="Color theme"
    >
      {themeOptions.map((option) => (
        <label
          key={option.value}
          className={`relative flex min-h-9 cursor-pointer items-center justify-center px-3 transition-colors not-first:border-l not-first:border-rule ${
            value === option.value
              ? 'bg-ink text-paper'
              : 'bg-paper text-muted hover:bg-soft hover:text-ink'
          }`}
        >
          <input
            type="radio"
            name="color-theme"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}