export function localizePath(locale: string, path: string) {
  if (!path || !path.startsWith("/")) {
    return path;
  }

  if (path.startsWith("/fr/") || path === "/fr" || path.startsWith("/en/") || path === "/en") {
    return path;
  }

  const prefix = locale.toLowerCase().startsWith("fr") ? "/fr" : "/en";
  return `${prefix}${path}`;
}

export function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}
