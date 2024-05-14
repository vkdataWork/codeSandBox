// @ts-nocheck
export function env(name: string, defaultValue: string | undefined = undefined): string | undefined {
  return import.meta.env[`VITE_${name}`] || defaultValue;
}