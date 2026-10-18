import type { ActivityLog } from "@/types/api";

type ActivityItemProps = {
  item: ActivityLog;
};

export function ActivityItem({ item }: ActivityItemProps) {
  const when = Number.isNaN(Date.parse(item.when))
    ? item.when
    : new Date(item.when).toLocaleString();

  return (
    <li className="card card-tight item-row">
      <div className="item-title">{item.action || "(no action)"}</div>
      <div>{item.info || "(no info)"}</div>
      <small className="muted">{when}</small>
    </li>
  );
}