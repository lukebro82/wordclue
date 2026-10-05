export interface WordItem {
  raw: string;
  normalized: string;
}

export const WORDS: string[] = [
  // 5 Letras
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

  // 6 Letras
  "Azúcar",
  "Bosque",
  "Camino",
  "Camisa",
  "Ciudad",
  "Cocina",
  "Comida",
  "Conejo",
  "Corona",
  "Cuerpo",
  "Espada",
  "Fuente",
  "Jardín",
  "Madera",
  "Música",
  "Pájaro",
  "Pelota",
  "Puerta",
  "Regalo",
  "Sirena",
  "Teatro",
  "Tomate",
  "Volcán",
  "Zapato",

  // 7 Letras
  "Batería",
  "Caballo",
  "Canción",
  "Cuchara",
  "Cultura",
  "Escuela",
  "Espacio",
  "Familia",
  "Hermoso",
  "Lectura",
  "Manzana",
  "Montaña",
  "Naranja",
  "Planeta",
  "Plátano",
  "Trabajo",
  "Ventana",
  "Batalla",
  "Botella",
  "Burbuja",
  "Carrera",
  "Destino",
  "Maestro",
  "Memoria",
  "Palabra",
  "Perfume",
  "Pintura",
  "Sistema",
  "Tornado",
];

/**
 * Normaliza una palabra eliminando acentos y diéresis, convirtiéndola a mayúsculas.
 * Respeta la letra Ñ.
 * Ej: "Árbol" -> "ARBOL", "Sueño" -> "SUEÑO", "Pingüino" -> "PINGUINO"
 */
export function normalizeWord(word: string): string {
  return word
    .toUpperCase()
    .replace(/[ÁÄ]/g, "A")
    .replace(/[ÉË]/g, "E")
    .replace(/[ÍÏ]/g, "I")
    .replace(/[ÓÖ]/g, "O")
    .replace(/[ÚÜ]/g, "U");
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
