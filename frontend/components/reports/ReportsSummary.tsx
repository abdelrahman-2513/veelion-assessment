"use client";

import { useTasksSummary } from "@/hooks/useTasksSummary";

export function ReportsSummary() {
  const { summary, loading, error, fetchSummary } = useTasksSummary();

  return (
    <section className="stack">
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Reports</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Task totals and recent activity from the last 24 hours.
        </p>
      </header>

      {loading ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0 }}>Loading report...</p>
        </section>
      ) : null}

      {error ? (
        <section
          className="card"
          style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}
        >
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--danger)" }}>
            {error}
          </p>
          <button type="button" className="button" onClick={fetchSummary}>
            Retry
          </button>
        </section>
      ) : null}

      {!loading && !error && summary ? (
        <>
          <section className="card" style={{ padding: "1rem" }}>
            <h2 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Total tasks</h2>
            <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>{summary.total}</p>
          </section>

          <section className="card" style={{ padding: "1rem" }}>
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>By status</h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
              <li>Todo: {summary.byStatus.todo}</li>
              <li>In progress: {summary.byStatus["in-progress"]}</li>
              <li>Done: {summary.byStatus.done}</li>
            </ul>
          </section>

          <section className="card" style={{ padding: "1rem" }}>
            <h2 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Recent activity</h2>
            <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>
              {summary.recentActivityCount}
            </p>
            <small style={{ color: "var(--muted)" }}>Entries from the last 24 hours</small>
          </section>
        </>
      ) : null}
    </section>
  );
}