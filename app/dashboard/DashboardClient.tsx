'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  FileText,
  Sparkles,
  AlertCircle,
  Tag,
} from 'lucide-react'

type Lernzettel = {
  id: string
  titel: string | null
  inhalt: string | null
  fach: string | null
  tags: string[] | null
  schwierigkeit: string | null
  file_name: string | null
  created_at: string
  updated_at: string
}

type Props = {
  lernzettel: Lernzettel[]
  userEmail: string
  loadError: string | null
}

const SCHWIERIGKEIT_COLORS: Record<string, string> = {
  leicht: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900',
  mittel: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900',
  schwer: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
}

export default function DashboardClient({ lernzettel, userEmail, loadError }: Props) {
  const [query, setQuery] = useState('')
  const [activeFach, setActiveFach] = useState<string | null>(null)

  const faecher = useMemo(() => {
    const set = new Set<string>()
    lernzettel.forEach((l) => l.fach && set.add(l.fach))
    return Array.from(set).sort()
  }, [lernzettel])

  const filtered = useMemo(() => {
    return lernzettel.filter((l) => {
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        (l.titel ?? '').toLowerCase().includes(q) ||
        (l.inhalt ?? '').toLowerCase().includes(q) ||
        (l.tags ?? []).some((t) => t.toLowerCase().includes(q))
      const matchesFach = !activeFach || l.fach === activeFach
      return matchesQuery && matchesFach
    })
  }, [lernzettel, query, activeFach])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <span className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shadow-lg shadow-blue-600/30">
                <BookOpen className="w-6 h-6 text-white" />
              </span>
              Meine Lernzettel
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Angemeldet als{' '}
              <span className="font-medium text-slate-700 dark:text-slate-300">{userEmail}</span>
            </p>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-600/20 transition"
          >
            <Plus className="w-5 h-5" />
            Neuer Lernzettel
          </Link>
        </div>

        {/* Error */}
        {loadError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Fehler beim Laden</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">{loadError}</p>
            </div>
          </div>
        )}

        {/* Suche + Fach-Filter */}
        {lernzettel.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Titel, Inhalt oder Tags durchsuchen…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {faecher.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFach(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    activeFach === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Alle ({lernzettel.length})
                </button>
                {faecher.map((f) => {
                  const count = lernzettel.filter((l) => l.fach === f).length
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFach(f)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        activeFach === f
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {f} ({count})
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {lernzettel.length === 0 && !loadError && (
          <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Noch keine Lernzettel
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              Lade dein erstes Dokument hoch und lass die KI daraus einen strukturierten Lernzettel erstellen.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-600/20 transition"
            >
              <Plus className="w-5 h-5" />
              Ersten Lernzettel erstellen
            </Link>
          </div>
        )}

        {/* Keine Treffer */}
        {lernzettel.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Keine Lernzettel gefunden.</p>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((l) => (
              <LernzettelCard key={l.id} l={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LernzettelCard({ l }: { l: Lernzettel }) {
  const preview = (l.inhalt ?? '')
    .replace(/[#*_`>\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140)

  const date = new Date(l.updated_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const schwClass = l.schwierigkeit
    ? SCHWIERIGKEIT_COLORS[l.schwierigkeit.toLowerCase()] ?? ''
    : ''

  return (
    <Link
      href={`/lernzettel/${l.id}`}
      className="group block p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
          {l.titel || 'Unbenannter Lernzettel'}
        </h3>
        {l.fach && (
          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
            {l.fach}
          </span>
        )}
      </div>

      {preview && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
          {preview}
        </p>
      )}

      {l.tags && l.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {l.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300"
            >
              <Tag className="w-3 h-3" />
              {t}
            </span>
          ))}
          {l.tags.length > 3 && (
            <span className="text-xs text-slate-400 self-center">
              +{l.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          {date}
        </div>
        {l.schwierigkeit && (
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${schwClass}`}>
            {l.schwierigkeit}
          </span>
        )}
      </div>
    </Link>
  )
}