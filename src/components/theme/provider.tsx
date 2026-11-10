import {
  createContext,
  use,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";
const ATTRIBUTE = "data-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

/* -------------------------------------------------------------------------- */
/* External store (localStorage + system preference)                          */
/* -------------------------------------------------------------------------- */

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system";

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.setAttribute(ATTRIBUTE, resolved);
  root.style.colorScheme = resolved;
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia(MEDIA_QUERY);
  const onSystemChange = () => {
    applyTheme(readTheme());
    emit();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    applyTheme(readTheme());
    emit();
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

function setStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage unavailable (private mode, etc.) - still apply for this session
  }
  applyTheme(theme);
  emit();
}

/* -------------------------------------------------------------------------- */
/* Blocking script: prevents a flash of the wrong theme before hydration      */
/* -------------------------------------------------------------------------- */

export const themeScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark')t='system';var d=t==='dark'||(t==='system'&&matchMedia('${MEDIA_QUERY}').matches);var r=document.documentElement;r.setAttribute('${ATTRIBUTE}',d?'dark':'light');r.style.colorScheme=d?'dark':'light'}catch(e){}})()`;
/* -------------------------------------------------------------------------- */
/* React context                                                              */
/* -------------------------------------------------------------------------- */

type ThemeContextValue = {
  /** The user's choice: light, dark, or system */
  theme: Theme;
  /** What is actually being displayed */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "system");
  const resolvedTheme = useSyncExternalStore<ResolvedTheme>(
    subscribe,
    () => resolveTheme(readTheme()),
    () => "light",
  );

  const setTheme = useCallback((next: Theme) => setStoredTheme(next), []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = use(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}

/** Call once before the first render to apply the stored theme. */
export function initTheme() {
  applyTheme(readTheme());
}
