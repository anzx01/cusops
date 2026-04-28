import type { LucideIcon } from "lucide-react";

export function MetricCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <section className="panel metric">
      <div className="metric-label">
        <Icon aria-hidden size={16} />
        {label}
      </div>
      <div className="metric-value">{value}</div>
      {note ? <div className="metric-note">{note}</div> : null}
    </section>
  );
}
