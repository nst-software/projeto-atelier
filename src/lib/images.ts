export const COVER_WIDTHS = [320, 480, 640, 800] as const;
export const PRINT_WIDTHS = [320, 480, 720, 960] as const;

export function netlifyImageUrl(src: string, width: number): string {
  const params = new URLSearchParams({ url: src, w: String(width) });
  return `/.netlify/images?${params}`;
}

export function buildSrcSet(src: string, widths: readonly number[]): string {
  return widths.map((width) => `${netlifyImageUrl(src, width)} ${width}w`).join(", ");
}
