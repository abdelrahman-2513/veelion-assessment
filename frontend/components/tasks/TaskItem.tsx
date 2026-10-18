import type { Task } from "@/types/api";

type TaskItemProps = {
  task: Task;
  busy: boolean;
  onToggle: (task: Task) => void;
};

export function TaskItem({ task, busy, onToggle }: TaskItemProps) {
  return (
    <li className="card card-tight item-row">
      <div className="item-row__top">
        <p className="item-title">{task.title}</p>
        <span className={task.completed ? "badge is-done" : "badge is-pending"}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>

      <small className="muted">Updated: {new Date(task.updatedAt).toLocaleString()}</small>

      <div>
        <button
          type="button"
          className="button"
          onClick={() => onToggle(task)}
          disabled={busy}
          aria-label={`Mark ${task.title} as ${task.completed ? "pending" : "completed"}`}
        >
          {busy ? "Saving..." : task.completed ? "Mark as Pending" : "Mark as Completed"}
        </button>
      </div>
    </li>
  );
}