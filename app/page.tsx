import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero-Bereich */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            ✨ Mit KI powered by Google Gemini
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Aus PDFs werden{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              perfekte Lernzettel
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Lade deine Skripte, Vorlesungsfolien oder Texte hoch. Die KI erstellt
            dir daraus strukturierte, übersichtliche Lernzettel – in Sekunden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition text-lg shadow-lg shadow-blue-600/20"
            >
              🚀 Jetzt ausprobieren
            </Link>
            <a
              href="#features"
              className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-8 py-4 rounded-lg transition text-lg border border-slate-200"
            >
              Mehr erfahren
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Warum LernKI?
            </h2>
            <p className="text-slate-600 text-lg">
              Effizienter lernen. Weniger Zeit mit Zusammenfassen verbringen.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Blitzschnell
              </h3>
              <p className="text-slate-600">
                In wenigen Sekunden wird aus einem PDF ein strukturierter
                Lernzettel – egal wie lang das Dokument ist.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Strukturiert
              </h3>
              <p className="text-slate-600">
                Kernaussagen, Begriffe, Zusammenfassung, Merkhilfen und
                Prüfungsfragen – alles ordentlich gegliedert.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Lernfreundlich
              </h3>
              <p className="text-slate-600">
                Speziell auf Schüler und Studenten zugeschnitten – mit
                Eselsbrücken und typischen Prüfungsfragen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* So funktioniert's */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              So funktioniert&apos;s
            </h2>
            <p className="text-slate-600 text-lg">
              In drei einfachen Schritten zum Lernzettel.
            </p>
          </div>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  PDF hochladen
                </h3>
                <p className="text-slate-600">
                  Wähle dein Skript, Vorlesungsfolien oder jedes andere PDF aus.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  KI analysiert
                </h3>
                <p className="text-slate-600">
                  Google Gemini liest das Dokument und identifiziert die
                  wichtigsten Inhalte.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  Lernzettel erhalten
                </h3>
                <p className="text-slate-600">
                  Dein fertiger Lernzettel erscheint direkt im Browser – bereit
                  zum Lernen.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/upload"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition text-lg shadow-lg shadow-blue-600/20"
            >
              Jetzt starten →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>
            Gebaut mit Next.js, Tailwind CSS und Google Gemini ·{" "}
            <span className="text-slate-300">Ein Lernprojekt</span>
          </p>
        </div>
      </footer>
    </main>
  );
}