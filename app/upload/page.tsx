"use client";

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Upload,
  FileText,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Brain,
  Zap,
  Shield,
  FileUp,
} from "lucide-react";

type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Optionen
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questionCount, setQuestionCount] = useState(5);

  // -------- File Handling --------
  const validateFile = (f: File): string | null => {
    if (f.type !== "application/pdf") return "Nur PDF-Dateien sind erlaubt.";
    if (f.size > 100 * 1024 * 1024) return "Die Datei darf max. 100 MB groß sein.";
    return null;
  };

  const handleFile = (f: File) => {
    const error = validateFile(f);
    if (error) {
      setErrorMsg(error);
      setState("error");
      return;
    }
    setErrorMsg("");
    setFile(f);
    setState("idle");
  };

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setState("idle");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // // -------- Submit --------
  const handleSubmit = async () => {
    if (!file) return;

    setState("uploading");
    setProgress(0);

    const uploadInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(uploadInterval);
          return 90;
        }
        return p + 10;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("schwierigkeit", difficulty);
      formData.append("anzahlFragen", String(questionCount));

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      clearInterval(uploadInterval);
      setProgress(100);
      setState("processing");

      if (!res.ok) throw new Error("Fehler beim Verarbeiten der Datei.");

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Unbekannter Fehler");
      }

      // ✨ Ergebnis in sessionStorage zwischenspeichern
      sessionStorage.setItem(
        "lernzettel-ergebnis",
        JSON.stringify(data.ergebnis)
      );
      sessionStorage.setItem("lernzettel-filename", data.fileName || file.name);

      setState("success");

      setTimeout(() => {
        router.push("/lernzettel"); // ⬅️ OHNE /[id], weil keine DB
      }, 1000);
    } catch (err) {
      clearInterval(uploadInterval);
      setState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten."
      );
    }
  };

  const isBusy = state === "uploading" || state === "processing";

  return (
        <ProtectedRoute>
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors relative overflow-hidden">
      {/* Animated BG-Blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-20 dark:opacity-10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-20 dark:opacity-10 blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back-Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-blue-200 dark:border-blue-900">
            <Sparkles className="w-4 h-4" />
            Schritt 1 von 1
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            PDF hochladen
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Lade dein Skript hoch und wir generieren daraus einen klausurreifen Lernzettel.
          </p>
        </motion.div>

        {/* Haupt-Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* === Upload-Zone === */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.01]"
                      : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={onInputChange}
                    className="hidden"
                  />
                  <motion.div
                    animate={isDragging ? { y: -8 } : { y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                      <FileUp className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {isDragging ? "Jetzt loslassen!" : "PDF hierher ziehen"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    oder <span className="text-blue-600 dark:text-blue-400 font-medium">klicke zum Auswählen</span>
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Nur PDF
                    </span>
                    <span>·</span>
                    <span>Max. 100 MB</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> DSGVO-konform
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="filepreview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatSize(file.size)} · PDF
                      </p>
                    </div>
                    {!isBusy && (
                      <button
                        onClick={removeFile}
                        className="flex-shrink-0 w-10 h-10 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition"
                        aria-label="Datei entfernen"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <AnimatePresence>
                    {isBusy && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                          <span className="flex items-center gap-1.5">
                            {state === "uploading" ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Lade hoch…
                              </>
                            ) : (
                              <>
                                <Brain className="w-3 h-3 animate-pulse" />
                                KI verarbeitet…
                              </>
                            )}
                          </span>
                          <span>{state === "uploading" ? `${progress}%` : "Analysiere"}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            initial={{ width: 0 }}
                            animate={{
                              width: state === "processing" ? "100%" : `${progress}%`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fehler-Meldung */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-red-900 dark:text-red-200">Fehler</p>
                    <p className="text-red-700 dark:text-red-300">{errorMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Erfolgs-Meldung */}
            <AnimatePresence>
              {state === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">
                    Lernzettel erstellt! Du wirst weitergeleitet…
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* === Optionen === */}
          {file && !isBusy && state !== "success" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-6 md:p-8 space-y-6">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Einstellungen
                </h3>

                {/* Schwierigkeit */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Schwierigkeit der Fragen
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "easy", label: "Einfach", emoji: "🌱" },
                      { val: "medium", label: "Mittel", emoji: "⚡" },
                      { val: "hard", label: "Schwer", emoji: "🔥" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setDifficulty(opt.val as typeof difficulty)}
                        className={`py-3 px-4 rounded-xl border-2 transition text-sm font-medium ${
                          difficulty === opt.val
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <div className="text-lg mb-0.5">{opt.emoji}</div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fragenanzahl */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Anzahl Prüfungsfragen
                    </label>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full">
                      {questionCount}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
                    <span>3</span>
                    <span>15</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* === Action-Button === */}
          {file && state !== "success" && (
            <div className="border-t border-slate-200 dark:border-slate-700 p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={handleSubmit}
                disabled={isBusy}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-lg"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {state === "uploading" ? "Lade hoch…" : "Generiere Lernzettel…"}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Lernzettel generieren
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* === Info-Cards unten === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-4 mt-8"
        >
          {[
            {
              icon: Zap,
              title: "Blitzschnell",
              desc: "< 30 Sekunden",
              color: "text-yellow-500",
              bg: "bg-yellow-100 dark:bg-yellow-950/50",
            },
            {
              icon: Brain,
              title: "Smarte KI",
              desc: "Google Gemini",
              color: "text-purple-500",
              bg: "bg-purple-100 dark:bg-purple-950/50",
            },
            {
              icon: Shield,
              title: "DSGVO",
              desc: "EU-Server",
              color: "text-green-500",
              bg: "bg-green-100 dark:bg-green-950/50",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4"
            >
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
    </ProtectedRoute>
  );
}