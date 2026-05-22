export function prepararContenidoParaIA(contenido: string | null | undefined, limite: number): string {
  if (!contenido) return '';

  return contenido
    .replace(/\s+/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim()
    .slice(0, limite);
}

export function crearHashContenido(contenido: string): string {
  let hash = 2166136261;

  for (let i = 0; i < contenido.length; i++) {
    hash ^= contenido.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
}
