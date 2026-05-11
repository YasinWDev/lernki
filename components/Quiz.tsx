"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  ChevronRight,
  RotateCcw,
  Trophy,
  Brain,
  Lightbulb,
} from "lucide-react";

/* ----------------------------------------------------------------
   Flexible Typen - akzeptiert verschiedene Feldnamen
---------------------------------------------------------------- */
type RawFrage = {
  id?: string;
  frage?: string;
  question?: string;
  antworten?: string[];
  optionen?: string[];
  options?: string[];
  answers?: string[];
  richtigeAntwort?: number;
  korrekteAntwort?: number;
  correctAnswer?: number;
  correct?: number;
  erklaerung?: string;
  explanation?: string;
};

type NormFrage = {
  id: string;
  frage: string;
  antworten: string[];
  richtigeAntwort: number;
  erklaerung?: string;
};

/* ----------------------------------------------------------------
   Normalisierung
---------------------------------------------------------------- */
function normalisiere(rohe: RawFrage[] | undefined | null): NormFrage[] {
  if (!Array.isArray(rohe)) return [];

  return rohe
    .map((f, idx): NormFrage | null => {
      const frage = f.frage ?? f.question ?? "";
      const antworten =
        f.antworten ?? f.optionen ?? f.options ?? f.answers ?? [];
      const richtigeAntwort =
        f.richtigeAntwort ??
        f.korrekteAntwort ??
        f.correctAnswer ??
        f.correct ??
        0;
      const erklaerung = f.erklaerung ?? f.explanation;

      if (!frage || !Array.isArray(antworten) || antworten.length === 0) {
        return null;
      }

      return {
        id: f.id ?? `q-${idx}`,
        frage,
        antworten,
        richtigeAntwort: Math.max(
          0,
          Math.min(richtigeAntwort, antworten.length - 1)
        ),
        erklaerung,
      };
    })
    .filter((f): f is NormFrage => f !== null);
}

/* ----------------------------------------------------------------
   Quiz Component
---------------------------------------------------------------- */
export default function Quiz({ fragen }: { fragen?: RawFrage[] | null }) {
  const normFragen = useMemo(() => normalisiere(fragen), [fragen]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // Edge Case: Keine Fragen
  if (normFragen.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">
          Keine Quiz-Fragen vorhanden.
        </p>
      </div>
    );
  }

  const aktuelle = normFragen[index];
  const total = normFragen.length;
  const progress = ((index + (answered ? 1 : 0)) / total) * 100;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === aktuelle.richtigeAntwort) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleReset = () => {
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setFinished(false);
  };

  /* --------------------------------------------------------------
     Finished Screen
  -------------------------------------------------------------- */
  if (finished) {
    const percent = Math.round((correctCount / total) * 100);
    const isGood = percent >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-8 md:p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
            isGood
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-amber-100 dark:bg-amber-900/30"
          }`}
        >
          <Trophy
            className={`w-10 h-10 ${
              isGood
                ? "text-green-600 dark:text-green-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          />
        </motion.div>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Quiz beendet!
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Du hast{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {correctCount} von {total}
          </span>{" "}
          Fragen richtig beantwortet.
        </p>

        <div className="max-w-xs mx-auto mb-8">
          <div className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {percent}%
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`h-full ${isGood ? "bg-green-500" : "bg-amber-500"}`}
            />
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          <RotateCcw className="w-4 h-4" />
          Nochmal versuchen
        </button>
      </motion.div>
    );
  }

  /* --------------------------------------------------------------
     Quiz View
  -------------------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Frage{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {index + 1}
            </span>{" "}
            von {total}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-green-600 dark:text-green-400">
              {correctCount}
            </span>{" "}
            richtig
          </div>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 dark:bg-blue-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Frage Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={aktuelle.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 md:p-8"
        >
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              {aktuelle.frage}
            </h3>
          </div>

          <div className="space-y-3">
            {aktuelle.antworten.map((antwort, i) => {
              const istAusgewaehlt = selected === i;
              const istKorrekteAntwort = i === aktuelle.richtigeAntwort;

              let style =
                "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50";

              if (answered) {
                if (istKorrekteAntwort) {
                  style =
                    "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600";
                } else if (istAusgewaehlt && !istKorrekteAntwort) {
                  style =
                    "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600";
                } else {
                  style =
                    "border-slate-200 dark:border-slate-700 opacity-60";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between gap-3 ${style} ${
                    !answered ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {antwort}
                  </span>
                  {answered && istKorrekteAntwort && (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  )}
                  {answered && istAusgewaehlt && !istKorrekteAntwort && (
                    <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Erklärung */}
          <AnimatePresence>
            {answered && aktuelle.erklaerung && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="flex gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {aktuelle.erklaerung}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-end"
            >
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                {index + 1 >= total ? "Ergebnis anzeigen" : "Nächste Frage"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}