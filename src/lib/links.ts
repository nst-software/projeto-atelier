export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function linkAttrs(href: string) {
  return isExternal(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
}
