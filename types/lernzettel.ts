export interface QuizFrage {
  id: string;
  frage: string;
  antworten: string[];
  richtigeAntwort: number; // Index 0-3
  erklaerung?: string;
}

export interface Karteikarte {
  id: string;              // ← nicht mehr optional
  vorderseite: string;
  rueckseite: string;
  kategorie: "begriff" | "konzept" | "frage" | "fakt";
}

export interface LernzettelErgebnis {
  titel: string;
  lernzettel: string;          // Markdown-Text
  quiz: QuizFrage[];
  karteikarten: Karteikarte[];
}