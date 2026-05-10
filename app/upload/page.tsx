"use client";

import { useState } from "react";

export default function UploadPage() {
  // State für die ausgewählte Datei
  const [file, setFile] = useState<File | null>(null);

  // Wird aufgerufen, wenn der User eine Datei auswählt
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  // Hilfsfunktion: Bytes → KB/MB
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
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
            />
          </label>
        </div>

        {/* Datei-Info (nur wenn Datei ausgewählt) */}
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
              <p>
                <span className="font-medium">Typ:</span> {file.type}
              </p>
            </div>

            <button
              onClick={() => alert("Analyse kommt in Phase 9!")}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
            >
              ✨ Lernzettel generieren
            </button>
          </div>
        )}
      </div>
    </main>
  );
}