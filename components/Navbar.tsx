import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-slate-800 hover:text-blue-600 transition"
        >
          <span className="text-2xl">📚</span>
          <span>LernKI</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-slate-600 hover:text-blue-600 transition font-medium"
          >
            Start
          </Link>
          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Lernzettel erstellen
          </Link>
        </div>
      </nav>
    </header>
  );
}