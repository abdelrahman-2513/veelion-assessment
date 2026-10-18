import Link from "next/link";

export default function HomePage() {
  return (
    <main className="stack">
      <header className="page-header">
        <h1>VeeLion Task Management</h1>
        <p>Tasks, activity, and a summary report against the local API.</p>
      </header>

      <section className="home-grid">
        <Link href="/tasks" className="card home-card">
          <h2>Task Dashboard</h2>
          <p>Filter tasks and update their status.</p>
        </Link>

        <Link href="/activity" className="card home-card">
          <h2>Activity Feed</h2>
          <p>Search recent actions across the app.</p>
        </Link>

        <Link href="/reports" className="card home-card">
          <h2>Reports</h2>
          <p>Totals by status and recent activity count.</p>
        </Link>
      </section>
    </main>
  );
}