import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hosté Admin Dashboard",
  description: "Hosté Marketplace Administration & Operations Portal",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-4 hidden lg:block">
        <div className="font-bold text-lg mb-6">Hosté Admin</div>
        <nav className="space-y-1 text-sm text-muted-foreground">
          {/* Navbar */}
        </nav>
      </aside>
      {/* Main content area */}
      <main className="flex-1 p-6 overflow-y-auto min-w-5xl">
        {children}
      </main>
    </div>
  );
}
