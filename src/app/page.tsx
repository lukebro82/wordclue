"use client";

import { useCallback, useEffect, useState } from "react";
import { cargarValidas, getRandomWord, normalizeWord, WordItem } from "@/lib/words";

const MAX_ATTEMPTS = 6;

type LetterStatus = "correct" | "present" | "absent";

interface LetterResult {
  letter: string;
  status: LetterStatus;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M", "BACKSPACE", "ENTER"],
];

/* Colores de las celdas del tablero (claro / oscuro) */
const CELL_STATUS: Record<LetterStatus, string> = {
  correct: "bg-[#4a7c59] text-white dark:bg-[#43a047]",
  present: "bg-[#c9a55a] text-white dark:bg-[#ffd600] dark:text-black",
  absent: "bg-[#94a3b8] text-white dark:bg-[#546e7a]",
};

/* Colores de las teclas del teclado virtual */
const KEY_STATUS: Record<LetterStatus, string> = {
  correct: "bg-[#4a7c59] text-white dark:bg-[#43a047]",
  present: "bg-[#c9a55a] text-white dark:bg-[#ffd600] dark:text-black",
  absent: "bg-[#94a3b8] text-white dark:bg-[#546e7a]",
};

const STATUS_PRIORITY: Record<LetterStatus, number> = {
  absent: 1,
  present: 2,
  correct: 3,
};

function checkWord(guess: string, secret: string): LetterResult[] {
  const secretArray = secret.split("");
  return guess.split("").map((letter, i) => ({
    letter,
    status:
      letter === secretArray[i]
        ? "correct"
        : secretArray.includes(letter)
          ? "present"
          : "absent",
  }));
}

/* ---------- Iconos ---------- */
const RefreshIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 text-[#00875a] dark:text-[#43a047]"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const GearIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M19.14 12.94a7.07 7.07 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.56-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.66 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.3.6.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.54c.05.24.25.42.49.42h3.84c.24 0 .45-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.63-.94l2.39.96c.22.08.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
  </svg>
);

const BackspaceIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59Z" />
  </svg>
);

export default function Home() {
  const [selectedLength, setSelectedLength] = useState<number>(5);
  const [secretWord, setSecretWord] = useState<WordItem | null>(null);
  const [attempts, setAttempts] = useState<LetterResult[][]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [error, setError] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  /* Diccionario de palabras válidas del largo actual (se carga bajo demanda) */
  const [validWords, setValidWords] = useState<{ largo: number; set: Set<string> } | null>(null);

  /* WORD_LENGTH se calcula dinámicamente según la palabra secreta seleccionada o la longitud elegida */
  const WORD_LENGTH = secretWord ? secretWord.normalized.length : selectedLength;
  const secretTarget = secretWord ? secretWord.normalized : "";
  const currentRow = attempts.length;
  const isGameFinished = gameOver || won;

  /* Seleccionar palabra aleatoria al iniciar el juego con la longitud por defecto (5) */
  useEffect(() => {
    setSecretWord(getRandomWord(selectedLength));
  }, []);

  /* Cargar el diccionario de validación del largo que se está jugando */
  useEffect(() => {
    let cancelado = false;
    cargarValidas(WORD_LENGTH)
      .then((set) => {
        if (!cancelado) setValidWords({ largo: WORD_LENGTH, set });
      })
      .catch(console.error);
    return () => {
      cancelado = true;
    };
  }, [WORD_LENGTH]);

  /* ---------- Tema ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(saved ? saved === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ---------- Lógica del juego ---------- */
  const handleSubmit = useCallback(() => {
    if (isGameFinished || !secretTarget) return;
    const upper = currentInput.toUpperCase().trim();
    if (upper.length !== WORD_LENGTH) {
      setError(`La palabra debe tener exactamente ${WORD_LENGTH} letras.`);
      return;
    }
    if (!validWords || validWords.largo !== WORD_LENGTH) {
      setError("Cargando diccionario… probá de nuevo en un instante.");
      return;
    }
    if (!validWords.set.has(normalizeWord(upper))) {
      setError("Esa palabra no está en el diccionario.");
      return;
    }
    setError("");
    const result = checkWord(upper, secretTarget);
    const newAttempts = [...attempts, result];
    setAttempts(newAttempts);
    setCurrentInput("");
    if (upper === secretTarget) setWon(true);
    else if (newAttempts.length >= MAX_ATTEMPTS) setGameOver(true);
  }, [attempts, currentInput, isGameFinished, secretTarget, WORD_LENGTH, validWords]);

  const handleKey = useCallback(
    (key: string) => {
      if (isGameFinished) return;
      if (key === "ENTER") return handleSubmit();
      if (key === "BACKSPACE") {
        setError("");
        setCurrentInput((prev) => prev.slice(0, -1));
        return;
      }
      if (/^[A-ZÑ]$/.test(key)) {
        setError("");
        setCurrentInput((prev) =>
          prev.length < WORD_LENGTH ? prev + key : prev
        );
      }
    },
    [handleSubmit, isGameFinished, WORD_LENGTH]
  );

  /* Teclado físico */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Evita que Enter/Espacio activen el botón que quedó con foco
      if (e.key === "Enter" || e.key === " " || e.key === "Backspace") {
        e.preventDefault();
      }
      if (e.key === "Enter") handleKey("ENTER");
      else if (e.key === "Backspace") handleKey("BACKSPACE");
      else handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  const handleReset = (targetLength?: number) => {
    const len = targetLength ?? selectedLength;
    setSecretWord(getRandomWord(len));
    setAttempts([]);
    setCurrentInput("");
    setError("");
    setGameOver(false);
    setWon(false);
  };

  const handleLengthChange = (len: number) => {
    setSelectedLength(len);
    handleReset(len);
  };

  /* Estado de cada letra para colorear el teclado */
  const keyStatuses: Record<string, LetterStatus> = {};
  attempts.flat().forEach(({ letter, status }) => {
    const prev = keyStatuses[letter];
    if (!prev || STATUS_PRIORITY[status] > STATUS_PRIORITY[prev]) {
      keyStatuses[letter] = status;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#eef2f7] dark:bg-[#121212] transition-colors duration-300">
      {/* ---------- Header ---------- */}
      <header className="w-full pt-3 pb-1">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-8 h-14 relative">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:absolute sm:left-1/2 sm:-translate-x-1/2 select-none">
            WORDCLUE
          </h1>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <button
              onClick={() => handleReset()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1e1e20] border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:bg-slate-50 dark:hover:bg-[#28282b] transition-all text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer active:scale-95"
            >
              <RefreshIcon />
              <span>Nuevo juego</span>
            </button>

            <button
              onClick={() => setDarkMode((d) => !d)}
              className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              aria-label={darkMode ? "Modo claro" : "Modo oscuro"}
              title={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Configuración"
            >
              <GearIcon />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Main ---------- */}
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-6">
        {/* Selector de cantidad de letras */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            LETRAS:
          </span>
          <div className="flex items-center gap-1 bg-[#dfe5ec] dark:bg-[#232325] p-1 rounded-full shadow-xs">
            {[5, 6, 7].map((len) => (
              <button
                key={len}
                onClick={() => handleLengthChange(len)}
                className={[
                  "w-7 h-7 flex items-center justify-center text-xs font-extrabold rounded-full transition-all duration-200 cursor-pointer",
                  selectedLength === len
                    ? "bg-[#00875a] text-white shadow-sm dark:bg-[#43a047]"
                    : "text-slate-600 hover:bg-slate-300/50 dark:text-slate-400 dark:hover:bg-[#3a3a3c]",
                ].join(" ")}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* Tablero */}
        <div className="relative">
          <div className="p-3 rounded-xl bg-[#e2e8f0]/60 dark:bg-[#232325] flex flex-col gap-2.5">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
              const attempt = attempts[rowIndex];
              const isCurrentRow = rowIndex === currentRow && !isGameFinished;

              return (
                <div key={rowIndex} className="flex gap-1.5 sm:gap-2">
                  {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                    const cell = attempt?.[colIndex];
                    const typedLetter = isCurrentRow
                      ? currentInput[colIndex]
                      : undefined;
                    const letter = cell?.letter ?? typedLetter ?? "";
                    const isActive =
                      isCurrentRow && colIndex === currentInput.length;

                    return (
                      <div
                        key={colIndex}
                        className={[
                          "w-10 h-10 sm:w-[52px] sm:h-[52px] flex items-center justify-center rounded-md",
                          "text-xl sm:text-2xl font-bold select-none transition-colors duration-300",
                          cell
                            ? CELL_STATUS[cell.status]
                            : isActive
                              ? "bg-white border border-[#4a7c59] dark:bg-[#141414] dark:border-[#43a047]"
                              : typedLetter
                                ? "bg-white border border-slate-400 text-slate-900 dark:bg-[#141414] dark:border-[#565758] dark:text-white"
                                : "bg-white border border-[#e2e8f0] shadow-sm dark:bg-[#141414] dark:border-[#2e2e2e] dark:shadow-none",
                        ].join(" ")}
                      >
                        {isActive ? (
                          <span className="caret-blink w-px h-6 bg-[#4a7c59] dark:bg-[#43a047]" />
                        ) : (
                          letter
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Mensaje de error (toast) */}
          {error && (
            <div className="absolute left-1/2 -top-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white dark:bg-white dark:text-black text-sm font-semibold px-4 py-2 shadow-lg">
              {error}
            </div>
          )}
        </div>

        {/* Mensajes de fin de juego */}
        {won && (
          <p className="text-[#4a7c59] dark:text-[#43a047] font-semibold text-lg">
            🎉 ¡Correcto! La palabra era {secretWord?.raw.toUpperCase()}.
          </p>
        )}
        {gameOver && !won && (
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
            😞 Perdiste. La palabra era <strong>{secretWord?.raw.toUpperCase()}</strong>.
          </p>
        )}

        {/* Teclado virtual */}
        <div className="w-full max-w-lg p-3 rounded-xl bg-[#e2e8f0]/60 dark:bg-[#232325] flex flex-col gap-2">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="flex justify-center gap-1.5">
              {row.map((key) => {
                const isWide = key === "ENTER";
                const status = keyStatuses[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleKey(key)}
                    className={[
                      "h-11 rounded-md flex items-center justify-center font-bold select-none",
                      "transition-colors duration-200 cursor-pointer active:scale-95",
                      isWide ? "flex-[2] max-w-[78px] text-[11px]" : "flex-1 max-w-9 text-xs",
                      status
                        ? KEY_STATUS[status]
                        : "bg-[#cbd5e1] text-slate-700 hover:bg-[#b8c4d4] dark:bg-[#3a3a3c] dark:text-white dark:hover:bg-[#4a4a4c]",
                    ].join(" ")}
                    aria-label={key === "BACKSPACE" ? "Borrar" : key}
                  >
                    {key === "BACKSPACE" ? <BackspaceIcon /> : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
