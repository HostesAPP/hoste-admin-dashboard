
export function MobileRestrictionPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex xl:hidden min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold">Desktop Only Access</h1>
        <p className="mt-2 text-muted-foreground">
          The Hosté Admin Dashboard is optimized for desktop viewports (minimum 1280px). Please access from a supported device.
        </p>
      </div>
      <div className="xl:flex min-h-full flex-col hidden">
        {children}
      </div>
    </>
  );
}