/**
 * Remove acentos, til, converte para lowercase e remove caracteres não alfanuméricos
 */
export function sanitizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos, til, etc)
    .replace(/[^a-z0-9\s]/g, ''); // Remove caracteres não alfanuméricos (mantém espaços)
}
