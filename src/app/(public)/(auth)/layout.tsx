export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="grid min-h-svh lg:grid-cols-3">
        <div className="relative hidden bg-muted lg:col-span-2 lg:block animated-gradient"/>
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
