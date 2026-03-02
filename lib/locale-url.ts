export function localeUrl(path: string, locale: string): string {
  const code = locale.toLowerCase().startsWith("fr") ? "fr" : "en";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${code}${clean}`;
}
