"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lernzettel, setLernzettel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLernzettel(null);
      setError(null);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  async function handleGenerate() {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setLernzettel(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Fehler beim Generieren");
      }

      setLernzettel(data.lernzettel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          📄 Lernzettel erstellen
        </h1>
        <p className="text-slate-600 mb-8">
          Lade ein PDF hoch und lass dir einen Lernzettel generieren.
        </p>

        {/* Upload-Bereich */}
        <div className="bg-white rounded-xl shadow-md p-8 border-2 border-dashed border-slate-300">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="text-5xl mb-4">📎</div>
            <span className="text-lg font-medium text-slate-700 mb-1">
              PDF-Datei auswählen
            </span>
            <span className="text-sm text-slate-500">
              Klicke hier, um eine Datei hochzuladen
            </span>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>

        {/* Datei-Info */}
        {file && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Ausgewählte Datei
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <span className="font-medium">Name:</span> {file.name}
              </p>
              <p>
                <span className="font-medium">Größe:</span>{" "}
                {formatFileSize(file.size)}
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      className="opacity-75"
                    />
                  </svg>
                  Lernzettel wird generiert...
                </>
              ) : (
                <>✨ Lernzettel generieren</>
              )}
            </button>
          </div>
        )}

        {/* Fehler-Anzeige */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">
              <span className="font-medium">Fehler:</span> {error}
            </p>
          </div>
        )}

        {/* Lernzettel-Anzeige */}
        {lernzettel && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              ✅ Dein Lernzettel
            </h2>
            <div className="prose prose-slate max-w-none whitespace-pre-wrap font-sans text-slate-700">
              {lernzettel}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}