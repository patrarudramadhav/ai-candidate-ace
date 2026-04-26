import { cn } from "@/lib/utils";

type Props = {
  score: number;
  size?: "sm" | "md";
  className?: string;
};

export function ScoreBadge({ score, size = "md", className }: Props) {
  const tier =
    score >= 80
      ? "bg-[hsl(var(--score-high-bg))] text-[hsl(var(--score-high))]"
      : score >= 60
        ? "bg-[hsl(var(--score-mid-bg))] text-[hsl(var(--score-mid))]"
        : "bg-[hsl(var(--score-low-bg))] text-[hsl(var(--score-low))]";

  return (
    <span
      className={cn(
        "tabular inline-flex items-center justify-center rounded-md font-semibold",
        size === "sm" ? "h-6 min-w-12 px-2 text-xs" : "h-8 min-w-14 px-2.5 text-sm",
        tier,
        className,
      )}
    >
      {Math.round(score)}
    </span>
  );
}
