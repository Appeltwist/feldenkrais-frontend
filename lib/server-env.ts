import "server-only";

export function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

export function getRequiredApiBase() {
  return getRequiredEnv("NEXT_PUBLIC_API_BASE").replace(/\/+$/, "");
}
