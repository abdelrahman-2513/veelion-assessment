import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/activity", label: "Activity" },
  { href: "/reports", label: "Reports" },
];

export function AppNav() {
  return (
    <nav
      aria-label="Main"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "1.25rem",
      }}
    >
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="button">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}