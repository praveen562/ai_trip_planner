/**
 * Tiny classNames combiner — no external dependency (clsx/tailwind-merge
 * weren't in the brief's tech stack). Accepts strings, falsy values, and
 * arrays; falsy values are dropped and the rest are joined with a space.
 * Last-class-wins is Tailwind's own cascade behavior, so no de-duping
 * logic is needed for the variant patterns used in this project.
 */
export type ClassValue = string | number | bigint | null | undefined | false | ClassValue[];

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return;
    if (Array.isArray(v)) {
      v.forEach(walk);
    } else {
      out.push(String(v));
    }
  };

  values.forEach(walk);
  return out.join(' ');
}
