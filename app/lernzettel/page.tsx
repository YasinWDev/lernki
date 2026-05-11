"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ArrowLeft,
  FileText,
  Download,
  RefreshCw,
  BookOpen,
  Brain,
  Copy,
  Check,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
} from "lucide-react";
import type { LernzettelErgebnis, Karteikarte } from "@/types/lernzettel";
import Quiz from "@/components/Quiz";

type Tab = "lernzettel" | "quiz" | "karteikarten";

export default function LernzettelPage() {
  const router = useRouter();
  const [ergebnis, setErgebnis] = useState<LernzettelErgebnis | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<Tab>("lernzettel");

  useEffect(() => {
    const raw = sessionStorage.getItem("lernzettel-ergebnis");
    const name = sessionStorage.getItem("lernzettel-filename");

    if (!raw) {
      router.replace("/upload");
      return;
    }

    try {
      setErgebnis(JSON.parse(raw));
      setFileName(name || "Dokument");
    } catch {
      router.replace("/upload");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleCopy = async () => {
    if (!ergebnis) return;
    await navigator.clipboard.writeText(ergebnis.lernzettel);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!ergebnis) return;
    const blob = new Blob([ergebnis.lernzettel], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ergebnis.titel || "lernzettel"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </main>
    );
  }

  if (!ergebnis) return null;

  return (
     <ProtectedRoute>
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back-Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Neues PDF hochladen
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
            <FileText className="w-4 h-4" />
            <span className="truncate">{fileName}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {ergebnis.titel}
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          <TabButton
            active={tab === "lernzettel"}
            onClick={() => setTab("lernzettel")}
            icon={<BookOpen className="w-4 h-4" />}
            label="Lernzettel"
          />
          <TabButton
            active={tab === "quiz"}
            onClick={() => setTab("quiz")}
            icon={<Brain className="w-4 h-4" />}
            label={`Quiz (${ergebnis.quiz?.length ?? 0})`}
          />
          <TabButton
            active={tab === "karteikarten"}
            onClick={() => setTab("karteikarten")}
            icon={<Layers className="w-4 h-4" />}
            label={`Karteikarten (${ergebnis.karteikarten?.length ?? 0})`}
          />
        </div>

        {/* Content */}
        {tab === "lernzettel" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden"
          >
            <div className="flex justify-end gap-2 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" /> Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Kopieren
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                <Download className="w-4 h-4" /> Markdown
              </button>
            </div>

            <article className="p-6 md:p-10">
              <MarkdownView markdown={ergebnis.lernzettel} />
            </article>
          </motion.div>
        )}

        {tab === "quiz" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Quiz fragen={ergebnis.quiz} />
          </motion.div>
        )}

        {tab === "karteikarten" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Karteikarten karten={ergebnis.karteikarten ?? []} />
          </motion.div>
        )}
      </div>
    </main>
  </ProtectedRoute>
  );
}

/* ----------------------------------------------------------------
   Tab Button
---------------------------------------------------------------- */
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition border-b-2 -mb-px whitespace-nowrap ${
        active
          ? "border-blue-600 text-blue-600 dark:text-blue-400"
          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ----------------------------------------------------------------
   Markdown Renderer (ohne externe Dependencies)
---------------------------------------------------------------- */
function MarkdownView({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let ulBuffer: string[] = [];
  let olBuffer: string[] = [];
  let paragraphBuffer: string[] = [];

  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("**")) {
        parts.push(
          <strong
            key={key++}
            className="font-semibold text-slate-900 dark:text-slate-100"
          >
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`")) {
        parts.push(
          <code
            key={key++}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-sm font-mono text-pink-600 dark:text-pink-400"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("*")) {
        parts.push(
          <em key={key++} className="italic">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  const flushUl = () => {
    if (ulBuffer.length) {
      const items = [...ulBuffer];
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="list-disc pl-6 space-y-2 my-4 text-slate-700 dark:text-slate-300 leading-relaxed"
        >
          {items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      ulBuffer = [];
    }
  };

  const flushOl = () => {
    if (olBuffer.length) {
      const items = [...olBuffer];
      elements.push(
        <ol
          key={`ol-${elements.length}`}
          className="list-decimal pl-6 space-y-2 my-4 text-slate-700 dark:text-slate-300 leading-relaxed"
        >
          {items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      olBuffer = [];
    }
  };

  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      const text = paragraphBuffer.join(" ");
      elements.push(
        <p
          key={`p-${elements.length}`}
          className="my-4 text-slate-700 dark:text-slate-300 leading-relaxed"
        >
          {renderInline(text)}
        </p>
      );
      paragraphBuffer = [];
    }
  };

  const flushAll = () => {
    flushUl();
    flushOl();
    flushParagraph();
  };

  lines.forEach((rawLine, i) => {
    const line = rawLine.trim();

    if (line.startsWith("# ")) {
      flushAll();
      elements.push(
        <h1
          key={`h1-${i}`}
          className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2 mb-6 pb-3 border-b border-slate-200 dark:border-slate-700"
        >
          {renderInline(line.slice(2))}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      flushAll();
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushAll();
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-2"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushOl();
      flushParagraph();
      ulBuffer.push(line.slice(2));
    } else if (/^\d+\.\s/.test(line)) {
      flushUl();
      flushParagraph();
      olBuffer.push(line.replace(/^\d+\.\s/, ""));
    } else if (line === "") {
      flushAll();
    } else {
      flushUl();
      flushOl();
      paragraphBuffer.push(line);
    }
  });

  flushAll();

  return <div className="max-w-none">{elements}</div>;
}

/* ----------------------------------------------------------------
   Karteikarten Komponente (inline, self-contained)
---------------------------------------------------------------- */
function Karteikarten({ karten }: { karten: Karteikarte[] }) {
  const [order, setOrder] = useState<number[]>(() =>
    karten.map((_, i) => i)
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gelernt, setGelernt] = useState<Set<string>>(new Set());

  const currentKarte = karten[order[index]];
  const total = karten.length;

  const next = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      setIndex((i) => (i + 1) % total);
    }, 150);
  }, [total]);

  const prev = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      setIndex((i) => (i - 1 + total) % total);
    }, 150);
  }, [total]);

  const shuffle = () => {
    const arr = [...order];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
    setIndex(0);
    setFlipped(false);
  };

  const reset = () => {
    setOrder(karten.map((_, i) => i));
    setIndex(0);
    setFlipped(false);
    setGelernt(new Set());
  };

  const toggleGelernt = () => {
    if (!currentKarte) return;
    setGelernt((prev) => {
      const neu = new Set(prev);
      if (neu.has(currentKarte.id)) neu.delete(currentKarte.id);
      else neu.add(currentKarte.id);
      return neu;
    });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (!karten || karten.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">
          Keine Karteikarten vorhanden.
        </p>
      </div>
    );
  }

  const kategorieStyles: Record<Karteikarte["kategorie"], string> = {
    begriff:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    konzept:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    frage:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    fakt:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  };

  const kategorieLabel: Record<Karteikarte["kategorie"], string> = {
    begriff: "Begriff",
    konzept: "Konzept",
    frage: "Frage",
    fakt: "Fakt",
  };

  const isGelernt = gelernt.has(currentKarte.id);
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="space-y-6">
      {/* Stats / Progress */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Karte{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {index + 1}
            </span>{" "}
            von {total}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-green-600 dark:text-green-400">
              {gelernt.size}
            </span>{" "}
            gelernt
          </div>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 dark:bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Flip Card */}
      <div
        className="relative w-full h-80 md:h-96 cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentKarte.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="relative w-full h-full"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Vorderseite */}
              <div
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg flex flex-col p-8 md:p-10"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      kategorieStyles[currentKarte.kategorie]
                    }`}
                  >
                    {kategorieLabel[currentKarte.kategorie]}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Vorderseite
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {currentKarte.vorderseite}
                  </p>
                </div>

                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
                  Klicken oder Leertaste zum Umdrehen
                </p>
              </div>

              {/* Rückseite */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border-2 border-blue-200 dark:border-blue-900/50 shadow-lg flex flex-col p-8 md:p-10"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      kategorieStyles[currentKarte.kategorie]
                    }`}
                  >
                    {kategorieLabel[currentKarte.kategorie]}
                  </span>
                  <span className="text-xs text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                    Rückseite
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
                  <p className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-relaxed">
                    {currentKarte.rueckseite}
                  </p>
                </div>

                <p className="text-center text-xs text-blue-400 dark:text-blue-500 mt-4">
                  Klicken zum Zurückdrehen
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={prev}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück
        </button>

        <button
          onClick={toggleGelernt}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
            isGelernt
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          }`}
        >
          <Check className="w-4 h-4" />
          {isGelernt ? "Gelernt" : "Als gelernt markieren"}
        </button>

        <button
          onClick={next}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-medium text-sm"
        >
          Weiter
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Utility Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={shuffle}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Shuffle className="w-4 h-4" />
          Mischen
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Zurücksetzen
        </button>
      </div>

      {/* Hint Text */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
        Tipp: Nutze die{" "}
        <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          ←
        </kbd>{" "}
        <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          →
        </kbd>{" "}
        Pfeiltasten und{" "}
        <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          Leertaste
        </kbd>{" "}
        zum Umdrehen.
      </p>
    </div>
  );
}
