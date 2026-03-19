import "server-only";

import { headers } from "next/headers";

function getPrimaryHost(host: string) {
  return host.split(",")[0]?.trim() ?? host;
}

export function stripPort(host: string) {
  return getPrimaryHost(host).replace(/:\d+$/, "");
}

export function resolveRuntimeHostname(rawHost: string | null | undefined) {
  const normalized = stripPort((rawHost ?? "").toLowerCase());
  const override = stripPort((process.env.HOSTNAME_OVERRIDE ?? "").toLowerCase());

  if (override && (!normalized || normalized === "localhost" || normalized === "127.0.0.1")) {
    return override;
  }

  return normalized || override || "localhost";
}

export function resolveRuntimeHost(rawHost: string | null | undefined) {
  const normalizedHost = getPrimaryHost((rawHost ?? "").toLowerCase());
  const normalizedHostname = stripPort(normalizedHost);
  const override = (process.env.HOSTNAME_OVERRIDE ?? "").trim().toLowerCase();

  if (
    override &&
    (!normalizedHostname || normalizedHostname === "localhost" || normalizedHostname === "127.0.0.1")
  ) {
    return override;
  }

  return normalizedHost || override || "localhost";
}

export function resolveRuntimeProtocol(rawProtocol: string | null | undefined) {
  const normalized = (rawProtocol ?? "").split(",")[0]?.trim().toLowerCase();

  if (normalized === "http" || normalized === "https") {
    return normalized;
  }

  return process.env.NODE_ENV === "development" ? "http" : "https";
}

export async function getHost() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";

  return resolveRuntimeHost(host);
}

export async function getHostname() {
  return stripPort(await getHost());
}

export async function getOrigin() {
  const requestHeaders = await headers();
  const protocol = resolveRuntimeProtocol(
    requestHeaders.get("x-forwarded-proto") ?? requestHeaders.get("x-forwarded-scheme"),
  );

  return `${protocol}://${await getHost()}`;
}
