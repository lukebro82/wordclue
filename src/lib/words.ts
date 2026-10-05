export interface WordItem {
  raw: string;
  normalized: string;
}

export const WORDS: string[] = [
  "Perro",
  "Llave",
  "Árbol",
  "Playa",
  "Libro",
  "Silla",
  "Nieve",
  "Avión",
  "Barco",
  "Bolsa",
  "Cable",
  "Campo",
  "Canoa",
  "Carro",
  "Carta",
  "Cerro",
  "Circo",
  "Cisne",
  "Clima",
  "Color",
  "Coral",
  "Disco",
  "Dulce",
  "Erizo",
  "Farol",
  "Fecha",
  "Fuego",
  "Fruta",
  "Gorro",
  "Hotel",
  "Hueso",
  "Joven",
  "Labio",
  "Leche",
  "Limón",
  "Magia",
  "Manta",
  "Monte",
  "Motor",
  "Mujer",
  "Sueño",
  "Selva",
  "Oasis",
  "Oveja",
  "Panda",
  "Pecho",
  "Piano",
  "Queso",
  "Radio",
  "Reina",
  "Torre",
];

/**
 * Normaliza una palabra eliminando acentos y convirtiéndola a mayúsculas.
 * Ej: "Árbol" -> "ARBOL"
 */
export function normalizeWord(word: string): string {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

/**
 * Obtiene una palabra aleatoria de la librería local.
 * Si se indica `length`, busca palabras con esa cantidad de letras.
 */
export function getRandomWord(length?: number): WordItem {
  let candidates = WORDS;
  if (length) {
    const filtered = WORDS.filter((w) => normalizeWord(w).length === length);
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }
  const randomIndex = Math.floor(Math.random() * candidates.length);
  const raw = candidates[randomIndex];
  return {
    raw,
    normalized: normalizeWord(raw),
  };
}

/**
 * Retorna las longitudes de palabras disponibles en la librería.
 */
export function getAvailableLengths(): number[] {
  const lengths = new Set(WORDS.map((w) => normalizeWord(w).length));
  return Array.from(lengths).sort((a, b) => a - b);
}
