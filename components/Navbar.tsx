"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/components/AuthContext";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header
      className="bg-white dark:bg-slate-900 
                 border-b border-slate-200 dark:border-slate-700 
                 sticky top-0 z-50 transition-colors"
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold 
                     text-slate-800 dark:text-slate-100 
                     hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <span className="text-2xl">📚</span>
          <span>LernKI</span>
        </Link>

        {/* Navigation Links + Theme Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="hidden sm:inline text-slate-600 dark:text-slate-300 
                       hover:text-blue-600 dark:hover:text-blue-400 
                       transition font-medium"
          >
            Start
          </Link>

          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 
                       dark:bg-blue-500 dark:hover:bg-blue-600
                       text-white px-4 py-2 rounded-lg transition font-medium text-sm"
          >
            Lernzettel erstellen
          </Link>

          {/* Auth-Bereich */}
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <UserIcon className="w-4 h-4" />
                    <span className="truncate max-w-[120px]">
                      {user.name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                    title="Abmelden"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Abmelden</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Anmelden
                </Link>
              )}
            </>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}