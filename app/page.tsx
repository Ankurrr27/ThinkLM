import Link from "next/link";
import {
  FileText,
  MessageSquareText,
  PanelsTopLeft,
  type LucideIcon,
} from "lucide-react";
import Logo from "../components/Logo";

const features: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: PanelsTopLeft,
    title: "Workspaces",
    description: "Separate projects, documents, and chats cleanly.",
  },
  {
    icon: FileText,
    title: "PDF Intelligence",
    description: "Index uploaded research documents for retrieval.",
  },
  {
    icon: MessageSquareText,
    title: "Grounded Chat",
    description: "Ask questions against selected workspace context.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Sticky navbar ─────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(10,10,15,0.85)",
          padding: "0 1.5rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo size={30} showText />

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/login" className="secondary-button px-4 no-underline" style={{ fontSize: "0.875rem" }}>
            Login
          </Link>
          <Link href="/signup" className="primary-button px-4 no-underline" style={{ fontSize: "0.875rem" }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <main className="min-h-screen px-4 py-6">
        <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-6xl flex-col justify-center">
          <div className="max-w-3xl">
            {/* Logo mark above headline */}
            <div style={{ marginBottom: "1.5rem" }}>
              <Logo size={48} showText={false} />
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
              AI research assistant
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              A premium workspace for research PDFs.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
              Upload documents, organize projects, and ask grounded questions
              through a compact, professional research surface.
            </p>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Link href="/signup" className="primary-button px-5 no-underline">
                Get started free
              </Link>
              <Link href="/login" className="secondary-button px-5 no-underline">
                Login
              </Link>
            </div>
          </div>

          {/* ── Feature cards ─────────────────────────────────── */}
          <section aria-label="Features" className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="panel p-5">
                <Icon className="h-5 w-5 text-[var(--accent)]" />
                <h2 className="mt-4 text-sm font-bold text-[var(--text)]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

