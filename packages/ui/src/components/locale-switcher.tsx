import { cn } from '../cn';

export type LocaleCode = 'EN' | 'SN' | 'ND';

export interface LocaleSwitcherProps {
  value: LocaleCode;
  onChange: (next: LocaleCode) => void;
  className?: string;
}

const LOCALES: readonly { code: LocaleCode; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'SN', label: 'ChiShona' },
  { code: 'ND', label: 'isiNdebele' },
];

export function LocaleSwitcher({ value, onChange, className }: LocaleSwitcherProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn(
        'inline-flex rounded border border-granite-300 bg-white p-0.5 text-xs',
        className,
      )}
    >
      {LOCALES.map((l) => {
        const active = l.code === value;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(l.code)}
            className={cn(
              'px-2.5 py-1 rounded transition-colors',
              active
                ? 'bg-heritage-900 text-white'
                : 'text-granite-700 hover:bg-granite-100',
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
