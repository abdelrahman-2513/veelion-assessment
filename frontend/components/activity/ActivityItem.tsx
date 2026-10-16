import type { ActivityLog } from "@/types/api";

type ActivityItemProps = {
  item: ActivityLog;
};

export function ActivityItem({ item }: ActivityItemProps) {
  const when = Number.isNaN(Date.parse(item.when))
    ? item.when
    : new Date(item.when).toLocaleString();

  return (
    <li
      className="card"
      style={{
        padding: "0.85rem",
        display: "grid",
        gap: "0.35rem",
      }}
    >
      <div style={{ fontWeight: 600 }}>{item.action || "(no action)"}</div>
      <div>{item.info || "(no info)"}</div>
      <small style={{ color: "var(--muted)" }}>{when}</small>
    </li>
  );
}