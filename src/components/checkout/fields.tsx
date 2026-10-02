import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const control =
  "h-12 w-full border border-ink bg-white px-3 text-sm placeholder:text-muted/60 focus:outline-2 focus:outline-offset-1 focus:outline-ink aria-invalid:border-accent";

type FieldShellProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

function FieldShell({ id, label, optional, error, hint, children, className = "" }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-accent">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
};

export function TextField({ name, label, optional, error, hint, className, ...input }: TextFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell id={id} label={label} optional={optional} error={error} hint={hint} className={className}>
      <input
        id={id}
        name={name}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={control}
        {...input}
      />
    </FieldShell>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label: string;
  options: readonly string[];
  error?: string;
  className?: string;
};

export function SelectField({ name, label, options, error, className, ...select }: SelectFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell id={id} label={label} error={error} className={className}>
      <select
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={control}
        {...select}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </FieldShell>
  );
}

type ChoiceProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  description: string;
  aside?: string;
};

export function Choice({ name, value, checked, onChange, title, description, aside }: ChoiceProps) {
  return (
    <label
      className={`flex cursor-pointer gap-3 border p-3.5 ${
        checked ? "border-ink bg-paper" : "border-ink/25 bg-ink/[0.03] hover:border-ink/60"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-0.5 size-4 accent-ink"
      />
      <span className="flex-1">
        <span className="flex justify-between gap-2">
          <span className="text-sm font-medium">{title}</span>
          {aside && <span className="font-mono text-[0.6875rem]">{aside}</span>}
        </span>
        <span className="mt-0.5 block text-xs text-muted">{description}</span>
      </span>
    </label>
  );
}

export function Step({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="flex items-baseline gap-3 border-b border-ink pb-2.5">
        <span className="font-mono text-[0.625rem]">{number}</span>
        <span className="text-lg font-medium">{title}</span>
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
