import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Copy, ExternalLink, RotateCw } from "lucide-react";
import { AppShell, CommandSearch, TokenGlyph, VerdictBadge } from "@/components/app-shell";
import { recentScans, report, shortAddr, verdictFor, verdictMeta } from "@/lib/scan-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/token/$address")({
  head: ({ params }) => ({
    meta: [
      { title: `Forensic report ${params.address.slice(0, 6)}… — Proxima Checker` },
      { name: "description", content: "Bundle threat score, diagnostic breakdown and block-0 buyer ledger for this Solana token." },
      { property: "og:title", content: "Token forensic report — Proxima Checker" },
      { property: "og:description", content: "Bundle threat score and block-0 buyer ledger." },
    ],
  }),
  component: Report,
});

const toneText = { unlikely: "text-ok", possible: "text-warn", likely: "text-high", dumped: "text-info" } as const;
const toneStroke = { unlikely: "stroke-ok", possible: "stroke-warn", likely: "stroke-high", dumped: "stroke-info" } as const;
const toneBg = { unlikely: "bg-ok", possible: "bg-warn", likely: "bg-high", dumped: "bg-info" } as const;

function Report() {
  const { address } = Route.useParams();
  const scan = recentScans.find((s) => s.address === address) ?? recentScans[0];
  const score = scan.score;
  const v = verdictFor(score);

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Scanner
        </Link>
        <div className="w-full max-w-md"><CommandSearch compact /></div>
      </div>

      {/* Header */}
      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <TokenGlyph symbol={scan.symbol} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight">{scan.name}</h1>
                <span className="font-mono text-[13px] text-muted-foreground">${scan.symbol}</span>
                <VerdictBadge verdict={v} />
              </div>
              <div className="mt-2 flex items-center gap-2 font-mono text-[12px] text-faint">
                <span className="truncate">{address}</span>
                <Copy className="size-3 shrink-0 hover:text-foreground" />
                <ExternalLink className="size-3 shrink-0 hover:text-foreground" />
              </div>
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-2 divide-border overflow-hidden rounded-md border border-border sm:grid-cols-5 sm:divide-x">
            {report.metrics.map((m) => (
              <div key={m.label} className="bg-surface-sunken/50 px-4 py-3">
                <dt className="text-[11px] text-faint">{m.label}</dt>
                <dd className="mt-1 font-mono text-[15px]">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ScoreGauge score={score} />
      </section>

      {/* Diagnostic grid */}
      <section className="mt-10">
        <SectionHeading title="Diagnostic breakdown" meta={`${report.categories.reduce((a, c) => a + c.pts, 0)} of 100 pts`} />
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {report.categories.map((c, i) => {
            const pct = (c.pts / c.max) * 100;
            const tone = pct === 0 ? "unlikely" : pct < 40 ? "possible" : "likely";
            return (
              <div key={c.name} className="bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium">
                    <span className="mr-2 font-mono text-[11px] text-faint">0{i + 1}</span>{c.name}
                  </span>
                  <span className="font-mono text-[12px]">
                    <span className={c.pts ? "text-foreground" : "text-faint"}>+{c.pts}</span>
                    <span className="text-faint">/{c.max}</span>
                  </span>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: c.max }).map((_, k) => (
                    <span key={k} className={cn("h-1 flex-1 rounded-[1px]", k < c.pts ? toneBg[tone] : "bg-muted")} />
                  ))}
                </div>
                <dl className="mt-4 space-y-2">
                  {c.rows.map(([k, val]) => (
                    <div key={k} className="flex justify-between text-[12.5px]">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-mono">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      <BuyerLedger />

      <div className="mt-6 flex items-center justify-between font-mono text-[11px] text-faint">
        <span>Analyzed {report.analyzed} · slot {report.slot}</span>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground">
          <RotateCw className="size-3" /> Rescan
        </button>
      </div>
    </AppShell>
  );
}

function SectionHeading({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="text-sm font-medium">{title}</h2>
      {meta && <span className="font-mono text-[11px] text-faint">{meta}</span>}
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const v = verdictFor(score);
  // 240° arc
  const r = 64, c = 2 * Math.PI * r, arc = c * (240 / 360);
  const filled = arc * (score / 100);
  const ticks = Array.from({ length: 11 });
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-faint">Bundle threat score</span>
        <span className="font-mono text-[11px] text-faint">model v2</span>
      </div>
      <div className="relative mx-auto mt-2 size-[176px]">
        <svg viewBox="0 0 176 176" className="size-full rotate-[150deg]">
          <circle cx="88" cy="88" r={r} fill="none" className="stroke-muted" strokeWidth="6" strokeDasharray={`${arc} ${c}`} strokeLinecap="butt" />
          <circle cx="88" cy="88" r={r} fill="none" className={toneStroke[v]} strokeWidth="6" strokeDasharray={`${filled} ${c}`} />
          {ticks.map((_, i) => {
            const a = ((i * 24) * Math.PI) / 180;
            return (
              <line key={i} x1={88 + Math.cos(a) * 76} y1={88 + Math.sin(a) * 76} x2={88 + Math.cos(a) * (i % 5 === 0 ? 82 : 79)} y2={88 + Math.sin(a) * (i % 5 === 0 ? 82 : 79)} className="stroke-faint" strokeWidth="1" />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[44px] font-medium leading-none tracking-tight">{score}</span>
          <span className="mt-1 font-mono text-[11px] text-faint">/ 100</span>
        </div>
      </div>
      <div className="-mt-2 text-center">
        <span className={cn("text-[13px] font-medium", toneText[v])}>{verdictMeta[v].label} Proxima bundle</span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-px overflow-hidden rounded-sm bg-border font-mono text-[10px]">
        {([["0–14", "unlikely"], ["15–34", "possible"], ["35–69", "likely"], ["70+", "likely"]] as const).map(([r, t], i) => (
          <div key={r} className={cn("bg-surface-sunken px-1 py-1.5 text-center", (i === 0 ? v === "unlikely" : i === 1 ? v === "possible" : i === 2 && v === "likely") ? toneText[t] : "text-faint")}>{r}</div>
        ))}
      </div>
    </div>
  );
}

function BuyerLedger() {
  const [open, setOpen] = useState(true);
  return (
    <section className="mt-10">
      <SectionHeading title={`Block-0 buyers (${report.buyers.length})`} meta={`slot ${report.slot}`} />
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-b border-border bg-surface-sunken/60 px-4 py-2.5 text-[12px] text-muted-foreground hover:text-foreground">
          <span>On-chain ledger · wallets that bought in the creation slot</span>
          <ChevronDown className={cn("size-4 transition-transform", !open && "-rotate-90")} />
        </button>
        {open && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-faint">
                  <th className="px-4 py-2.5 font-normal">#</th>
                  <th className="px-4 py-2.5 font-normal">Wallet</th>
                  <th className="px-4 py-2.5 text-right font-normal">SOL in</th>
                  <th className="px-4 py-2.5 text-right font-normal">Tokens</th>
                  <th className="px-4 py-2.5 text-right font-normal">% Supply</th>
                  <th className="px-4 py-2.5 font-normal">Funding</th>
                  <th className="px-4 py-2.5 text-right font-normal">Tokens held</th>
                  <th className="px-4 py-2.5 text-right font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {report.buyers.map((b, i) => (
                  <tr key={b.wallet} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                    <td className="px-4 py-3 text-faint">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        {shortAddr(b.wallet)}
                        <Copy className="size-3 text-faint hover:text-foreground" />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{b.sol}</td>
                    <td className="px-4 py-3 text-right">{b.tokens}</td>
                    <td className="px-4 py-3 text-right">{b.supply}</td>
                    <td className="px-4 py-3 font-sans text-muted-foreground">{b.funding}</td>
                    <td className="px-4 py-3 text-right">{b.tokensHeld}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground"><span className="size-1.5 rounded-full bg-ok" />{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
