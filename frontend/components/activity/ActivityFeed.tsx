"use client";

import { useActivity } from "@/hooks/useActivity";
import { ActivityItem } from "@/components/activity/ActivityItem";

export function ActivityFeed() {
  const { activity, filteredActivity, query, setQuery, loading, error, fetchActivity } =
    useActivity();

  const emptyMessage = query.trim()
    ? "No activity matches this search."
    : "No activity yet.";

  return (
    <section className="stack">
      <section className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Activity Feed</h1>
        <label htmlFor="activity-search" style={{ display: "block", marginBottom: "0.4rem" }}>
          Search activity
        </label>
        <input
          id="activity-search"
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </section>

      {loading ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0 }}>Loading activity...</p>
        </section>
      ) : null}

      {error ? (
        <section
          className="card"
          style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}
        >
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--danger)" }}>{error}</p>
          <button type="button" className="button" onClick={fetchActivity}>
            Retry
          </button>
        </section>
      ) : null}

      {!loading && !error ? (
        <>
          <section className="card" style={{ padding: "1rem" }}>
            <small style={{ color: "var(--muted)" }}>
              Total: {activity.length} | Visible: {filteredActivity.length}
            </small>
          </section>

          {filteredActivity.length === 0 ? (
            <section className="card" style={{ padding: "1rem" }}>
              <p style={{ margin: 0, color: "var(--muted)" }}>{emptyMessage}</p>
            </section>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.7rem" }}>
              {filteredActivity.map((item) => (
                <ActivityItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </>
      ) : null}
    </section>
  );
}