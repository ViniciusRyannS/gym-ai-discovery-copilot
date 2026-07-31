import { motion } from "motion/react";
import { DISCOVERY_CATEGORIES } from "@/lib/discovery-defaults";

interface Props {
  coverage: Record<string, number>;
  primaryCategory?: string | null;
}

export function CoverageCockpit({ coverage, primaryCategory }: Props) {
  const cats = DISCOVERY_CATEGORIES;
  const n = cats.length;
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size / 2 - 24;

  const points = cats.map((c, i) => {
    const v = Math.max(0.02, coverage[c.key] ?? 0);
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = rMax * v;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  const rings = [0.25, 0.5, 0.75, 1];
  const overall = Object.values(coverage).reduce((a, b) => a + b, 0) / n;

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg">Cobertura</h3>
        <div className="font-mono-tabular text-2xl text-foreground">
          {(overall * 100).toFixed(0)}
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>

      <div className="relative mx-auto mt-3" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          {rings.map((r) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={rMax * r}
              fill="none"
              stroke="oklch(1 0 0 / 6%)"
              strokeDasharray={r === 1 ? "0" : "2 4"}
            />
          ))}
          {cats.map((_, i) => {
            const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + Math.cos(angle) * rMax}
                y2={cy + Math.sin(angle) * rMax}
                stroke="oklch(1 0 0 / 5%)"
              />
            );
          })}
          <motion.polygon
            points={polygon}
            fill="oklch(0.72 0.22 300 / 20%)"
            stroke="oklch(0.78 0.2 300)"
            strokeWidth={1.5}
            initial={false}
            animate={{ points: polygon }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 12px oklch(0.72 0.22 300 / 60%))" }}
          />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="oklch(0.78 0.2 300)" />
          ))}
        </svg>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {cats.map((c) => {
          const v = coverage[c.key] ?? 0;
          const isPrimary = primaryCategory === c.key;
          return (
            <li
              key={c.key}
              className={`flex items-center justify-between text-[11px] ${
                isPrimary ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className="truncate">{c.short}</span>
              <span className="font-mono-tabular tabular-nums">{(v * 100).toFixed(0)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}