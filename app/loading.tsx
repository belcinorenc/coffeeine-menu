export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-16">
      <div className="surface w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-coffee-200" />
        <p className="font-serif text-2xl text-coffee-800">Preparing the menu...</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Freshly brewing Coffeeine&apos;s latest menu.
        </p>
      </div>
    </main>
  );
}
