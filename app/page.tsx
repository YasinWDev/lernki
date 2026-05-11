"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  GraduationCap,
  Upload,
  Brain,
  FileText,
  Shield,
  Lock,
  Server,
  CheckCircle2,
  ArrowRight,
  Trash2,
  Eye,
  Globe,
} from "lucide-react";

// Animation-Varianten wiederverwendbar
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors overflow-hidden">
      {/* ============ HERO ============ */}
      <section className="relative py-24 px-6">
        {/* Animierte Hintergrund-Blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-30 dark:opacity-20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-30 dark:opacity-20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/3 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-30 dark:opacity-20 blur-3xl"
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto text-center relative"
        >
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-blue-200 dark:border-blue-900">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight tracking-tight"
          >
            Lernen war noch nie{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              so einfach
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed"
          >
            Verwandle <strong className="text-slate-900 dark:text-white">jedes PDF</strong> in
            perfekte Lernzettel, Karteikarten und Quizze.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-base text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto"
          >
            Spar dir Stunden beim Zusammenfassen. Die KI macht&apos;s in Sekunden –
            strukturiert, klausurreif und DSGVO-konform.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="group bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-8 py-4 rounded-lg transition text-lg shadow-lg shadow-blue-600/30 dark:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              Jetzt kostenlos starten
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#preview"
              className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium px-8 py-4 rounded-lg transition text-lg border border-slate-200 dark:border-slate-700"
            >
              Beispiel ansehen
            </a>
          </motion.div>

          {/* Mini Trust-Badges unter CTA */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Keine Kreditkarte nötig
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              DSGVO-konform
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Server in der EU
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ STATS-BAR ============ */}
      <section className="py-12 px-6 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { num: "< 30 Sek", label: "pro Lernzettel" },
            { num: "10x", label: "schneller lernen" },
            { num: "100%", label: "DSGVO-konform" },
            { num: "∞", label: "PDFs pro Monat (Pro)" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stat.num}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-24 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Alles was du zum Lernen brauchst
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Eine App, alle Lern-Tools. Von der Zusammenfassung bis zur Prüfungssimulation.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Zap,
                color: "text-yellow-500",
                bg: "bg-yellow-100 dark:bg-yellow-950/50",
                title: "Blitzschnell",
                desc: "Aus 50-seitigen Skripten werden in unter 30 Sekunden strukturierte Lernzettel.",
              },
              {
                icon: Target,
                color: "text-blue-500",
                bg: "bg-blue-100 dark:bg-blue-950/50",
                title: "Strukturiert",
                desc: "Kernaussagen, Begriffe, Merkhilfen und Prüfungsfragen – sauber gegliedert.",
              },
              {
                icon: GraduationCap,
                color: "text-indigo-500",
                bg: "bg-indigo-100 dark:bg-indigo-950/50",
                title: "Klausurreif",
                desc: "Mit Eselsbrücken, Karteikarten und typischen Prüfungsfragen zur optimalen Vorbereitung.",
              },
              {
                icon: Brain,
                color: "text-purple-500",
                bg: "bg-purple-100 dark:bg-purple-950/50",
                title: "Karteikarten",
                desc: "Automatisch generierte Flashcards mit 3D-Flip-Animation für aktives Lernen.",
              },
              {
                icon: FileText,
                color: "text-green-500",
                bg: "bg-green-100 dark:bg-green-950/50",
                title: "Export-Optionen",
                desc: "Download als PDF, Markdown oder Anki-Deck. Dein Lernzettel, deine Wahl.",
              },
              {
                icon: Sparkles,
                color: "text-pink-500",
                bg: "bg-pink-100 dark:bg-pink-950/50",
                title: "Anpassbar",
                desc: "Schwierigkeit, Fragenanzahl und Detailtiefe – alles frei einstellbar.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ PREVIEW ============ */}
      <section id="preview" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              So sieht dein Lernzettel aus
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Ein Beispiel aus dem Fach Biologie – Photosynthese.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Fake Browser-Header */}
            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 text-center text-xs text-slate-500 dark:text-slate-400">
                lernki.app/lernzettel/photosynthese
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  Biologie · Mittelstufe
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Photosynthese
                </h3>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  🎯 Kernaussagen
                </h4>
                <ul className="space-y-2">
                  {[
                    "Pflanzen wandeln Sonnenlicht in chemische Energie (Glukose) um.",
                    "Findet in den Chloroplasten statt, genauer: in den Thylakoiden.",
                    "Benötigt: CO₂, H₂O, Licht → Produkte: Glukose (C₆H₁₂O₆) + O₂.",
                  ].map((p, i) => (
                    <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  💡 Eselsbrücke
                </h4>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  „6 CO₂ trifft 6 H₂O, und plötzlich wird&apos;s froh: Zucker entsteht – und Sauerstoff
                  dazu!"
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  ❓ Prüfungsfragen
                </h4>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <p>
                    <strong>F:</strong> Wo findet die Lichtreaktion statt?
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>A:</strong> In den Thylakoidmembranen der Chloroplasten.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ DSGVO / SICHERHEIT ============ */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-green-200 dark:border-green-900">
              <Shield className="w-4 h-4" />
              100% DSGVO-konform
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Deine Daten. Deine Kontrolle.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Made in Germany. Wir nehmen Datenschutz ernst – nicht nur auf dem Papier.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Server,
                title: "Server in der EU",
                desc: "Alle Daten werden ausschließlich auf Servern in Deutschland verarbeitet.",
              },
              {
                icon: Lock,
                title: "SSL-Verschlüsselung",
                desc: "Ende-zu-Ende verschlüsselte Übertragung deiner PDFs – immer.",
              },
              {
                icon: Trash2,
                title: "Automatische Löschung",
                desc: "Ohne Account werden Dokumente direkt nach der Verarbeitung gelöscht.",
              },
              {
                icon: Globe,
                title: "Keine Weitergabe",
                desc: "Deine Dokumente werden niemals an Dritte verkauft oder geteilt.",
              },
              {
                icon: Eye,
                title: "Volle Transparenz",
                desc: "Einsicht, Export und Löschung deiner Daten jederzeit möglich.",
              },
              {
                icon: Shield,
                title: "Kein Training",
                desc: "Deine Inhalte werden nicht zum Training von KI-Modellen verwendet.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ SO FUNKTIONIERT'S ============ */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              In 3 Schritten zum Lernzettel
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Kein Setup, keine Einarbeitung. Einfach hochladen und lernen.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            {[
              {
                icon: Upload,
                title: "PDF hochladen",
                desc: "Skripte, Folien oder Notizen – bis zu 100 MB pro Datei.",
              },
              {
                icon: Brain,
                title: "KI analysiert",
                desc: "Google Gemini extrahiert die wichtigsten Inhalte und strukturiert sie.",
              },
              {
                icon: FileText,
                title: "Lernzettel erhalten",
                desc: "Direkt lernen, exportieren oder als Karteikarten üben.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-shrink-0 relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                    {i + 1}
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 md:p-16 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-grid-white/10 opacity-20" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Bereit für bessere Noten?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Schließe dich tausenden Studierenden an, die schneller und effektiver lernen.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-blue-600 font-semibold px-8 py-4 rounded-lg transition text-lg shadow-xl"
            >
              Jetzt kostenlos starten
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-blue-100 text-sm mt-4">Keine Kreditkarte · Sofort loslegen</p>
          </div>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-slate-900 dark:bg-black text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-lg mb-2">LernKI</div>
              <p className="text-sm">KI-gestützte Lernzettel für Schüler und Studenten.</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-sm">Rechtliches</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/impressum" className="hover:text-white transition">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="hover:text-white transition">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link href="/agb" className="hover:text-white transition">
                    AGB
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-sm">Kontakt</div>
              <ul className="space-y-2 text-sm">
                <li>support@lernki.app</li>
                <li>Made in Germany 🇩🇪</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-sm">
            <p>
              © {new Date().getFullYear()} LernKI · Gebaut mit Next.js, Tailwind & Gemini
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}