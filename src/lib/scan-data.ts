export type Verdict = "unlikely" | "possible" | "likely" | "dumped";

export const verdictMeta: Record<Verdict, { label: string; tone: string; dot: string }> = {
  unlikely: { label: "Unlikely", tone: "text-ok border-ok/25 bg-ok/8", dot: "bg-ok" },
  possible: { label: "Possible", tone: "text-warn border-warn/25 bg-warn/8", dot: "bg-warn" },
  likely: { label: "Likely", tone: "text-high border-high/25 bg-high/8", dot: "bg-high" },
  dumped: { label: "Dumped", tone: "text-info border-info/25 bg-info/8", dot: "bg-info" },
};

export function verdictFor(score: number): Verdict {
  if (score < 15) return "unlikely";
  if (score < 35) return "possible";
  return "likely";
}

export type Scan = {
  symbol: string;
  name: string;
  address: string;
  ago: string;
  mcap: string;
  block0: number;
  supply: string;
  cex: string;
  score: number;
  verdict: Verdict;
};

export const recentScans: Scan[] = [
  { symbol: "ONION", name: "Onion", address: "GNZBkDriPAgDXbwigo34cfACpL2nEd1sX1W4wr8Kpump", ago: "24m", mcap: "$3.4K", block0: 2, supply: "0.0%", cex: "0/2", score: 18, verdict: "possible" },
  { symbol: "CAPDOG", name: "Cap Dog", address: "Gd6cR2mPq8vLxT4nWzYh7KbJ3sFa9eUo1iDcN5pump", ago: "26m", mcap: "$197.2K", block0: 1, supply: "0.0%", cex: "0/1", score: 22, verdict: "dumped" },
  { symbol: "MEMEOS", name: "MemeOS", address: "5q5pXk2LmN8vRt3YwQz9HbJ4cFa7eUo6iDsG1pump", ago: "27m", mcap: "$483.8K", block0: 1, supply: "0.0%", cex: "0/1", score: 22, verdict: "dumped" },
  { symbol: "ONION", name: "Onion", address: "669Df9CmNckBxf3jAx6F7rS8XsAXATcS8dPXjqwXpump", ago: "29m", mcap: "$88.4K", block0: 1, supply: "0.0%", cex: "0/1", score: 12, verdict: "unlikely" },
  { symbol: "IP", name: "Intellectual Prop", address: "7bDhWq3LmK9vRt2YxPz8HcJ5nFa4eUo7iDsM2pump", ago: "30m", mcap: "—", block0: 4, supply: "0.0%", cex: "1/4", score: 42, verdict: "likely" },
];

export const shortAddr = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

export const report = {
  slot: "459,209,137",
  analyzed: "2026-10-20 17:08:40 UTC",
  metrics: [
    { label: "Market cap", value: "$3.4K" },
    { label: "Block-0 wallets", value: "2" },
    { label: "Bundle supply", value: "0.0%" },
    { label: "CEX-funded", value: "0 / 2" },
    { label: "Dump status", value: "Holding" },
  ],
  categories: [
    { name: "Block-0 bundle", pts: 10, max: 35, rows: [["Wallets in creation slot", "2"], ["Creation slot", "459,209,137"]] },
    { name: "Wallet profiling", pts: 8, max: 20, rows: [["Multi-token wallets", "1 of 2"], ["Cluster signal", "None"]] },
    { name: "CEX funding", pts: 0, max: 15, rows: [["CEX-funded", "0%"], ["Same-source cluster", "No"]] },
    { name: "Supply concentration", pts: 0, max: 15, rows: [["Bundle wallet holdings", "0.0%"], ["Top holders tracked", "19"]] },
    { name: "Coordinated dump", pts: 0, max: 10, rows: [["Coordinated sells", "0 / 2"], ["Status", "Holding"]] },
    { name: "Volume bot", pts: 0, max: 5, rows: [["Wash trade pairs", "0"], ["Looping wallets", "0"]] },
  ],
  buyers: [
    { wallet: "8xKq4mT2vRpL9nYwZ3cH7bJ5sFa1eUo6iDgN4rWq", sol: "1.250", tokens: "41,203,551", supply: "4.12%", funding: "Fresh · 3 hops", tokensHeld: 7, status: "Holding" },
    { wallet: "3FvNp8LmQ2xRt6YwKz4HbJ9cDa5eUo1iSgM7tPkE", sol: "0.480", tokens: "15,882,004", supply: "1.59%", funding: "Unknown", tokensHeld: 1, status: "Holding" },
  ],
};
