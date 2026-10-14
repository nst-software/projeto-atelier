export interface RedirectSource {
  id: string;
  legacyId: number;
}

export const STATIC_REDIRECTS: readonly (readonly [from: string, to: string])[] = [
  ["/quemSomos", "/quem-somos/"],
];

export function buildRedirectLines(entries: RedirectSource[]): string[] {
  const rules = [
    ...[...entries]
      .sort((a, b) => a.legacyId - b.legacyId)
      .map((entry) => [`/catalogo/${entry.legacyId}`, `/catalogo/${entry.id}/`] as const),
    ...STATIC_REDIRECTS,
  ];
  return rules.map(([from, to]) => `${from} ${to} 301`);
}

export function renderRedirects(lines: string[]): string {
  return `${lines.join("\n")}\n`;
}
