"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Erst nach dem Mount das echte Theme anzeigen
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🛡️ Vor dem Mount: Platzhalter rendern, der EXAKT die gleiche Struktur hat
  // wie der gehydrierte Button – nur ohne dynamischen Inhalt
  if (!mounted) {
    return (
      <button
        className="w-10 h-10 flex items-center justify-center rounded-lg 
                   bg-white dark:bg-slate-800"
        aria-label="Theme wechseln"
        suppressHydrationWarning
      >
        {/* leer während SSR, um Mismatch zu vermeiden */}
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-lg 
                 bg-white dark:bg-slate-800 hover:bg-slate-100 
                 dark:hover:bg-slate-700 transition-colors"
      aria-label="Theme wechseln"
      title={`Zu ${isDark ? "hell" : "dunkel"} wechseln`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  );
}