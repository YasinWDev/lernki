import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";
import type { LernzettelErgebnis } from "@/types/lernzettel";

export async function POST(request: Request) {
  try {
    // 1. FormData auspacken
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const anzahlFragenRaw = formData.get("anzahlFragen");
    const schwierigkeitRaw = formData.get("schwierigkeit");
    const anzahlKartenRaw = formData.get("anzahlKarten"); // 👈 NEU (optional)

    // 🔍 DEBUG 1
    console.log("🔍 RAW FormData:", {
      fileName: file?.name,
      anzahlFragenRaw,
      schwierigkeitRaw,
      anzahlKartenRaw,
    });

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Keine Datei empfangen" },
        { status: 400 }
      );
    }

    // 2. Validierung & Defaults
    const anzahlFragen = Math.min(
      Math.max(Number(anzahlFragenRaw) || 5, 1),
      20
    );

    // Karteikarten: Default 10, Range 5–25
    const anzahlKarten = Math.min(
      Math.max(Number(anzahlKartenRaw) || 10, 5),
      25
    );

    const schwierigkeitsMap: Record<string, "leicht" | "mittel" | "schwer"> = {
      easy: "leicht",
      medium: "mittel",
      hard: "schwer",
      leicht: "leicht",
      mittel: "mittel",
      schwer: "schwer",
    };

    const schwierigkeit =
      schwierigkeitsMap[schwierigkeitRaw as string] ?? "mittel";

    // 🔍 DEBUG 2
    console.log("📥 Generierung startet mit:", {
      anzahlFragen,
      anzahlKarten,
      schwierigkeit,
    });

    // 3. Datei in Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // 4. Gemini-Client
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 5. Schwierigkeits-Infos
    const schwierigkeitsInfo = {
      leicht:
        "LEICHT – Einfache Reproduktionsfragen. Direkte Fakten aus dem Text. Die richtige Antwort soll klar erkennbar sein, Ablenker offensichtlich falsch.",
      mittel:
        "MITTEL – Verständnisfragen, die Zusammenhänge testen. Ablenker sollen plausibel klingen und typische Missverständnisse widerspiegeln.",
      schwer:
        "SCHWER – Anwendungs- und Transferfragen. Kombiniere mehrere Konzepte. Ablenker sollen inhaltlich sehr ähnlich zur richtigen Antwort sein.",
    }[schwierigkeit];

    // 6. Prompt
    const prompt = `Du bist ein erfahrener Lerncoach. Analysiere das beigefügte PDF-Dokument und erstelle auf Deutsch:

1. Einen strukturierten Lernzettel (als Markdown)
2. Ein Quiz mit **GENAU ${anzahlFragen} Multiple-Choice-Fragen** (nicht mehr, nicht weniger!)
3. Ein Karteikarten-Set mit **GENAU ${anzahlKarten} Karteikarten**

## Schwierigkeitsgrad der Quizfragen: ${schwierigkeitsInfo}

Für den LERNZETTEL verwende diese Struktur (als Markdown):

# [Titel des Themas]

## 📌 Kernaussagen
- Die 3-5 wichtigsten Punkte in kurzen, prägnanten Sätzen

## 📖 Wichtige Begriffe
- **Begriff:** Kurze, klare Definition

## 🔑 Zusammenfassung
Ein kompakter Fließtext (max. 150 Wörter).

## 💡 Merkhilfen
- Eselsbrücken, Beispiele oder Analogien

## ❓ Prüfungsfragen
1. Frage 1
2. Frage 2
3. Frage 3

Für das QUIZ:
- **GENAU ${anzahlFragen} Fragen** – bitte zähle nach!
- Jede Frage hat genau 4 Antwort-Optionen
- "richtigeAntwort" ist der Index (0-3) der korrekten Option
- "erklärung" erklärt kurz (1-2 Sätze), warum die Antwort richtig ist
- Die Fragen müssen dem Schwierigkeitsgrad "${schwierigkeit}" entsprechen

Für die KARTEIKARTEN:
- **GENAU ${anzahlKarten} Karteikarten** – bitte zähle nach!
- Basierend auf den wichtigsten Inhalten des PDFs (NICHT identisch mit den Quizfragen!)
- Jede Karte enthält:
  - "vorderseite": Ein Begriff, eine Frage ODER ein Kernkonzept (kurz, max. 10 Wörter, prägnant)
  - "rueckseite": Die Definition, Antwort oder Erklärung (1-3 Sätze, verständlich formuliert)
  - "kategorie": Eines von "begriff" | "konzept" | "frage" | "fakt"
- Mische die Kategorien für Abwechslung:
  - "begriff" für Fachwörter + Definition
  - "konzept" für größere Ideen/Theorien/Zusammenhänge
  - "frage" für prüfungsartige W-Fragen
  - "fakt" für Zahlen, Daten, Jahreszahlen, konkrete Fakten
- Karten sollen eigenständig lernbar sein (genug Kontext auf der Rückseite)
- Fokus auf das, was man sich MERKEN muss

Gib außerdem einen passenden "titel" zurück (max. 5 Wörter).

WICHTIG:
- Das Array "quiz" muss EXAKT ${anzahlFragen} Einträge enthalten.
- Das Array "karteikarten" muss EXAKT ${anzahlKarten} Einträge enthalten.`;

    // 7. Schema mit min/maxItems
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        titel: { type: Type.STRING },
        lernzettel: { type: Type.STRING },
        quiz: {
          type: Type.ARRAY,
          minItems: anzahlFragen,
          maxItems: anzahlFragen,
          items: {
            type: Type.OBJECT,
            properties: {
              frage: { type: Type.STRING },
              optionen: {
                type: Type.ARRAY,
                minItems: 4,
                maxItems: 4,
                items: { type: Type.STRING },
              },
              richtigeAntwort: { type: Type.INTEGER },
              erklärung: { type: Type.STRING },
            },
            required: ["frage", "optionen", "richtigeAntwort", "erklärung"],
          },
        },
        karteikarten: {
          type: Type.ARRAY,
          minItems: anzahlKarten,
          maxItems: anzahlKarten,
          items: {
            type: Type.OBJECT,
            properties: {
              vorderseite: { type: Type.STRING },
              rueckseite: { type: Type.STRING },
              kategorie: {
                type: Type.STRING,
                enum: ["begriff", "konzept", "frage", "fakt"],
              },
            },
            required: ["vorderseite", "rueckseite", "kategorie"],
          },
        },
      },
      required: ["titel", "lernzettel", "quiz", "karteikarten"],
    };

    // 8. Gemini-Request
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
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error("Keine Antwort von Gemini erhalten");
    }

    const ergebnis: LernzettelErgebnis = JSON.parse(rawText);

    // 9. IDs für Karteikarten ergänzen (Gemini liefert keine IDs)
    ergebnis.karteikarten = ergebnis.karteikarten.map((k, i) => ({
      ...k,
      id: `card-${Date.now()}-${i}`,
    }));

    // 🔍 DEBUG 3
    console.log("✅ Gemini Antwort:", {
      titel: ergebnis.titel,
      anzahlErhaltenerFragen: ergebnis.quiz.length,
      erwarteteFragen: anzahlFragen,
      anzahlErhaltenerKarten: ergebnis.karteikarten.length,
      erwarteteKarten: anzahlKarten,
    });

    return NextResponse.json({
      success: true,
      ergebnis: ergebnis,
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