import "server-only";

export function getOptionalEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function getRequiredEnv(name: string) {
  const value = getOptionalEnv(name);

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

export function getRequiredApiBase() {
  return getRequiredEnv("NEXT_PUBLIC_API_BASE").replace(/\/+$/, "");
}
