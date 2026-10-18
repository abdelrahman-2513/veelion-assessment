"use client";

import { useTasksSummary } from "@/hooks/useTasksSummary";

export function ReportsSummary() {
  const { summary, loading, error, fetchSummary } = useTasksSummary();

  return (
    <section className="stack">
      <header className="card page-header">
        <h1>Reports</h1>
        <p>Task totals and recent activity from the last 24 hours.</p>
      </header>

      {loading ? (
        <section className="card">
          <p className="muted" style={{ margin: 0 }}>
            Loading report...
          </p>
        </section>
      ) : null}

      {error ? (
        <section className="card alert">
          <p>{error}</p>
          <button type="button" className="button" onClick={fetchSummary}>
            Retry
          </button>
        </section>
      ) : null}

      {!loading && !error && summary ? (
        <>
          <section className="stat-grid">
            <article className="card stat-card">
              <h2 className="muted" style={{ marginTop: 0, marginBottom: "0.35rem", fontSize: "0.95rem" }}>
                Total tasks
              </h2>
              <p className="stat-value">{summary.total}</p>
            </article>

            <article className="card stat-card">
              <h2 className="muted" style={{ marginTop: 0, marginBottom: "0.35rem", fontSize: "0.95rem" }}>
                Recent activity
              </h2>
              <p className="stat-value">{summary.recentActivityCount}</p>
              <small className="muted">Last 24 hours</small>
            </article>
          </section>

          <section className="card">
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>By status</h2>
            <div className="status-grid">
              <div className="status-pill">
                <span className="muted">Todo</span>
                <strong>{summary.byStatus.todo}</strong>
              </div>
              <div className="status-pill">
                <span className="muted">In progress</span>
                <strong>{summary.byStatus["in-progress"]}</strong>
              </div>
              <div className="status-pill">
                <span className="muted">Done</span>
                <strong>{summary.byStatus.done}</strong>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </section>
  );
}