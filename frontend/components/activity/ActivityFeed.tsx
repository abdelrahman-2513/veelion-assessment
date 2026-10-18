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
      <section className="card page-header">
        <h1>Activity Feed</h1>
        <p>Search actions and info across the log.</p>
        <label htmlFor="activity-search" className="field-label">
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
        <section className="card">
          <p className="muted" style={{ margin: 0 }}>
            Loading activity...
          </p>
        </section>
      ) : null}

      {error ? (
        <section className="card alert">
          <p>{error}</p>
          <button type="button" className="button" onClick={fetchActivity}>
            Retry
          </button>
        </section>
      ) : null}

      {!loading && !error ? (
        <>
          <section className="card meta-bar">
            Total: {activity.length} | Visible: {filteredActivity.length}
          </section>

          {filteredActivity.length === 0 ? (
            <section className="card">
              <p className="muted" style={{ margin: 0 }}>
                {emptyMessage}
              </p>
            </section>
          ) : (
            <ul className="item-list">
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