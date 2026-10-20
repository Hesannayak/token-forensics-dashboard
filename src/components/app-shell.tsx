import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { verdictMeta, type Verdict } from "@/lib/scan-data";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-6 place-items-center rounded-sm border border-border bg-surface-raised">
              <span className="size-2 rounded-[1px] bg-foreground" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Proxima</span>
            <span className="font-mono text-[11px] text-faint">checker</span>
          </Link>
          <nav className="hidden items-center gap-5 text-[13px] text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>Scanner</Link>
            <span className="cursor-default">Watchlist</span>
            <span className="cursor-default">Methodology</span>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <NetworkStatus />
            <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">3/5 scans</span>
            <button className="h-8 rounded-md border border-border bg-surface-raised px-3 text-[13px] font-medium hover:bg-accent">Upgrade</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-24">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl justify-between px-6 py-5 font-mono text-[11px] text-faint">
          <span>proxima.check · v2.4.1</span>
          <span>Not financial advice</span>
        </div>
      </footer>
    </div>
  );
}

export function NetworkStatus() {
  return (
    <div className="hidden items-center gap-3 rounded-md border border-border bg-surface-sunken px-2.5 py-1 font-mono text-[11px] text-muted-foreground lg:flex">
      <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-ok" />Solana</span>
      <span className="h-3 w-px bg-border" />
      <span>slot 459.21M</span>
      <span className="h-3 w-px bg-border" />
      <span>RPC 38ms</span>
    </div>
  );
}

export function CommandSearch({ defaultValue = "", compact = false }: { defaultValue?: string; compact?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); ref.current?.focus(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const submit = () => {
    const a = value.trim() || "GNZBkDriPAgDXbwigo34cfACpL2nEd1sX1W4wr8Kpump";
    navigate({ to: "/token/$address", params: { address: a } });
  };
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      className={cn(
        "group flex items-center rounded-lg border border-input bg-surface-sunken transition-colors focus-within:border-ring",
        compact ? "h-10" : "h-12",
      )}
    >
      <span className="flex h-full items-center gap-1.5 border-r border-border px-3 font-mono text-[11px] text-muted-foreground">
        <span className="size-1.5 rounded-full bg-ok" /> SOL
      </span>
      <Search className="ml-3 size-4 text-faint" />
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Paste token mint address…"
        spellCheck={false}
        className="h-full flex-1 bg-transparent px-3 font-mono text-[13px] text-foreground outline-none placeholder:text-faint"
      />
      <kbd className="mr-2 hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">⌘K</kbd>
      <button type="submit" className={cn("mr-1 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90", compact ? "h-8" : "h-10")}>
        Analyze
      </button>
    </form>
  );
}

export function VerdictBadge({ verdict, className }: { verdict: Verdict; className?: string }) {
  const m = verdictMeta[verdict];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider", m.tone, className)}>
      <span className={cn("size-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

export function TokenGlyph({ symbol }: { symbol: string }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-md border border-border bg-surface-raised font-mono text-[10px] text-muted-foreground">
      {symbol.slice(0, 2)}
    </span>
  );
}
