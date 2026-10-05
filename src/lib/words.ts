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

/* ---------- Diccionario para VALIDAR lo que escribe el jugador ----------
 * Las palabras secretas salen de WORDS (lista curada, arriba). En cambio, lo que
 * el jugador puede escribir se valida contra una lista grande de palabras en
 * español, generada con `npm run generar:diccionario`. Se carga solo para el
 * largo que se está jugando (un archivo aparte por largo).
 */
type Modulo = { default: string[] };

// Un cargador explícito por largo: así el bundler separa cada lista en su
// propio archivo y el navegador solo baja la que hace falta.
const CARGADORES: Record<number, () => Promise<Modulo>> = {
  5: () => import("../data/palabras-validas-5.json"),
  6: () => import("../data/palabras-validas-6.json"),
  7: () => import("../data/palabras-validas-7.json"),
};

const cacheValidas = new Map<number, Promise<Set<string>>>();

/**
 * Devuelve el conjunto de palabras válidas (MAYÚSCULAS, sin tildes) de ese largo.
 * Siempre incluye las palabras de WORDS, así la palabra secreta nunca puede
 * quedar fuera de lo que el jugador tiene permitido escribir.
 */
export function cargarValidas(largo: number): Promise<Set<string>> {
  let pendiente = cacheValidas.get(largo);
  if (!pendiente) {
    const cargador = CARGADORES[largo];
    if (!cargador) {
      return Promise.reject(new Error(`No hay diccionario de ${largo} letras`));
    }
    pendiente = cargador().then((modulo) => {
      const propias = WORDS.map(normalizeWord).filter((w) => w.length === largo);
      return new Set<string>([...modulo.default, ...propias]);
    });
    cacheValidas.set(largo, pendiente);
  }
  return pendiente;
}
