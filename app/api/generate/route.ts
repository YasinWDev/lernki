import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. FormData auspacken
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Keine Datei empfangen" },
        { status: 400 }
      );
    }

    // 2. Datei in Base64 umwandeln (Gemini erwartet dieses Format)
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // 3. Gemini-Client erstellen
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 4. Prompt für den Lernzettel
    const prompt = `Du bist ein erfahrener Lerncoach. Analysiere das beigefügte PDF-Dokument und erstelle einen strukturierten, übersichtlichen Lernzettel auf Deutsch.

Der Lernzettel soll folgende Struktur haben:

# [Titel des Themas]

## 📌 Kernaussagen
- Die 3-5 wichtigsten Punkte in kurzen, prägnanten Sätzen

## 📖 Wichtige Begriffe
- **Begriff:** Kurze, klare Definition
- (mehrere Begriffe, je nach Inhalt)

## 🔑 Zusammenfassung
Ein kompakter Fließtext (max. 150 Wörter), der das Thema verständlich erklärt.

## 💡 Merkhilfen
- Eselsbrücken, Beispiele oder Analogien, die beim Merken helfen

## ❓ Prüfungsfragen
1. Frage 1
2. Frage 2
3. Frage 3
(3-5 typische Fragen zum Thema)

Nutze Markdown-Formatierung. Sei präzise, klar und lernfreundlich.`;

    // 5. Anfrage an Gemini mit PDF
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Data,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    // 6. Antwort zurückgeben
    return NextResponse.json({
      success: true,
      lernzettel: response.text,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}