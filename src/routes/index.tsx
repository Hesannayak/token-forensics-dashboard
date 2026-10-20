import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { AppShell, CommandSearch, TokenGlyph, VerdictBadge } from "@/components/app-shell";
import { recentScans, shortAddr } from "@/lib/scan-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Proxima Checker — Solana bundle forensics" },
      { name: "description", content: "Score any Solana token 0–100 for bundled launches using block-0 wallets, CEX funding and supply concentration." },
      { property: "og:title", content: "Proxima Checker — Solana bundle forensics" },
      { property: "og:description", content: "Score any Solana token 0–100 for bundled launches." },
    ],
  }),
  component: Index,
});

const stats = [
  ["Tokens scanned", "184,302"],
  ["Bundles flagged", "21,947"],
  ["Median scan", "1.8s"],
];

function Index() {
  return (
    <AppShell>
      <section className="mx-auto max-w-3xl pt-20 pb-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Bundle forensics · Solana</p>
        <h1 className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-tight">
          Is it a Proxima bundle?
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Paste a token mint to trace block-0 buyers, funding sources and supply concentration. Each launch receives a 0–100 threat score.
        </p>
        <div className="mt-8"><CommandSearch /></div>
        <dl className="mt-6 flex gap-8">
          {stats.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[11px] text-faint">{k}</dt>
              <dd className="font-mono text-[13px] text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm font-medium">Recent scans</h2>
          <span className="font-mono text-[11px] text-faint">live · updated 4s ago</span>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[820px] text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-sunken/60 text-left text-[11px] font-normal uppercase tracking-wider text-faint">
                <th className="px-4 py-2.5 font-normal">Token</th>
                <th className="px-4 py-2.5 font-normal">Mint</th>
                <th className="px-4 py-2.5 text-right font-normal">MCap</th>
                <th className="px-4 py-2.5 text-right font-normal">Block-0</th>
                <th className="px-4 py-2.5 text-right font-normal">Supply</th>
                <th className="px-4 py-2.5 text-right font-normal">CEX</th>
                <th className="px-4 py-2.5 text-right font-normal">Score</th>
                <th className="px-4 py-2.5 text-right font-normal">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {recentScans.map((s) => (
                <tr key={s.address} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <Link to="/token/$address" params={{ address: s.address }} className="flex items-center gap-3">
                      <TokenGlyph symbol={s.symbol} />
                      <span>
                        <span className="block font-medium">${s.symbol}</span>
                        <span className="block text-[11px] text-faint">{s.ago} ago</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
                      {shortAddr(s.address)}
                      <Copy className="size-3 text-faint hover:text-foreground" />
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{s.mcap}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.block0}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.supply}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.cex}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    <span className="text-foreground">{s.score}</span>
                    <span className="text-faint">/100</span>
                  </td>
                  <td className="px-4 py-3 text-right"><VerdictBadge verdict={s.verdict} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
