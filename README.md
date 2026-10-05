# WordClue

**WordClue** es un juego de palabras en español, al estilo Wordle. Tenés que adivinar una palabra oculta de **5, 6 o 7 letras** en un máximo de **6 intentos**.

## Cómo se juega

1. Elegí la cantidad de letras (5, 6 o 7) con el selector **LETRAS**.
2. Escribí una palabra con el teclado virtual o con el teclado físico y presioná **ENTER** para enviarla.
3. Después de cada intento, las casillas cambian de color:
   - 🟩 **Verde**: la letra está en la palabra y en la posición correcta.
   - 🟨 **Amarillo**: la letra está en la palabra pero en otra posición.
   - ⬜ **Gris**: la letra no está en la palabra.
4. Ganás si adivinás la palabra antes de agotar los 6 intentos. Si no, se te muestra la palabra correcta.

Al terminar la partida se abre un modal que dice si ganaste o perdiste y muestra la palabra secreta.

### Reglas

- Cada intento debe tener exactamente la cantidad de letras elegida.
- Cada intento debe ser una palabra válida del diccionario en español.
- Los acentos y diéresis no hacen falta al escribir (`ÁRBOL` se escribe `ARBOL`), pero la **Ñ** sí se respeta.

## Funcionalidades

- Palabras de 5, 6 y 7 letras.
- Teclado virtual que se colorea según las letras ya probadas.
- Soporte de teclado físico.
- Botón **Nuevo juego** para empezar otra partida en cualquier momento.
- Modal de ayuda (**?**) con las instrucciones y ejemplos.
- Modal de resultado al ganar o perder.
- Modo claro y oscuro (se recuerda tu elección y respeta la preferencia del sistema).
- Diseño responsive: el tablero y el teclado se adaptan al espacio disponible en mobile y desktop.

## Cómo funciona

- **Palabra secreta:** se elige al azar de una lista curada en [`src/lib/words.ts`](src/lib/words.ts).
- **Validación:** lo que escribe el jugador se valida contra un diccionario grande de palabras en español, con un archivo por largo en `src/data/` (`palabras-validas-5.json`, `-6.json` y `-7.json`). Solo se carga el archivo del largo que se está jugando.
- **Comparación:** las palabras se normalizan (mayúsculas y sin tildes) antes de compararlas con la palabra secreta.

## Tecnologías

- [Next.js](https://nextjs.org) 15 (App Router) y [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) 4

## Cómo correrlo

Requisitos: [Node.js](https://nodejs.org) instalado.

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

### Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Genera la versión de producción. |
| `npm run start` | Sirve la versión de producción. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run generar:diccionario` | Regenera los diccionarios de palabras válidas en `src/data/`. |

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx   # Layout raíz y metadatos
│   ├── page.tsx     # Pantalla del juego (tablero, teclado, modales)
│   └── globals.css  # Estilos globales
├── data/            # Diccionarios de palabras válidas por largo
└── lib/
    └── words.ts     # Lista de palabras secretas y utilidades
scripts/
└── generar-diccionario.js  # Genera los diccionarios de src/data/
```

## Agregar palabras secretas

Agregá la palabra (con sus tildes) a la lista `WORDS` de [`src/lib/words.ts`](src/lib/words.ts), dentro de la sección del largo que corresponda. Se incluye automáticamente en las palabras válidas.
