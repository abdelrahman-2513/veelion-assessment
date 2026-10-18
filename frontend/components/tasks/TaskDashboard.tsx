"use client";

import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types/api";
import { StatusFilter } from "@/components/tasks/StatusFilter";
import { TaskList } from "@/components/tasks/TaskList";

export function TaskDashboard() {
  const {
    filteredTasks,
    filter,
    loading,
    loadError,
    actionError,
    updatingTaskId,
    setFilter,
    fetchTasks,
    updateTaskStatus,
  } = useTasks();

  const handleToggle = (task: Task) => {
    updateTaskStatus(task.id, !task.completed);
  };

  return (
    <section className="stack">
      <header className="card page-header">
        <h1>Task Dashboard</h1>
        <p>Filter by status and toggle completion.</p>
      </header>

      <StatusFilter value={filter} onChange={setFilter} />

      {loading ? (
        <section className="card">
          <p className="muted" style={{ margin: 0 }}>
            Loading tasks...
          </p>
        </section>
      ) : null}

      {loadError ? (
        <section className="card alert">
          <p>{loadError}</p>
          <button type="button" className="button" onClick={fetchTasks}>
            Retry
          </button>
        </section>
      ) : null}

      {actionError ? (
        <section className="card alert">
          <p>{actionError}</p>
        </section>
      ) : null}

      {!loading && !loadError ? (
        <TaskList tasks={filteredTasks} updatingTaskId={updatingTaskId} onToggle={handleToggle} />
      ) : null}
    </section>
  );
}