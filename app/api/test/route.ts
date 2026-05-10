import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Client initialisieren mit deinem API-Key
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 2. Anfrage an Gemini schicken
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Sag mir in einem Satz, warum Lernzettel beim Lernen helfen.",
    });

    // 3. Antwort zurückgeben
    return NextResponse.json({
      success: true,
      answer: response.text,
    });
  } catch (error) {
    // Fehler abfangen und zurückgeben
    console.error("Gemini error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}