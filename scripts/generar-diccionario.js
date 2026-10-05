/* eslint-disable @typescript-eslint/no-require-imports */
// Genera src/data/palabras-validas-N.json (N = 5, 6, 7) con TODAS las palabras
// que el jugador puede escribir, en MAYÚSCULAS y sin tildes (la lista del
// paquete no trae tildes, y sí respeta la Ñ).
//
// Uso:  npm run generar:diccionario
// Corrélo una vez y commiteá los JSON.
//
// Las palabras SECRETAS siguen saliendo de tu array WORDS en src/lib/words.ts.

const fs = require("fs");
const path = require("path");
const palabras = require("an-array-of-spanish-words");

const LARGOS = [5, 6, 7];
const CARPETA_SALIDA = path.join(__dirname, "..", "src", "data");

fs.mkdirSync(CARPETA_SALIDA, { recursive: true });

for (const largo of LARGOS) {
  const validas = new Set();
  for (const p of palabras) {
    // Solo letras a-z y ñ: descarta cualquier cosa rara sin ambigüedad.
    if (p.length === largo && /^[a-zñ]+$/.test(p)) validas.add(p.toUpperCase());
  }
  const ruta = path.join(CARPETA_SALIDA, `palabras-validas-${largo}.json`);
  fs.writeFileSync(ruta, JSON.stringify([...validas]));
  const kb = (fs.statSync(ruta).size / 1024).toFixed(1);
  console.log(`✔ palabras-validas-${largo}.json: ${validas.size} palabras, ${kb} KB`);
}
