export default function AdminLoading() {
  return (
    <div className="surface flex min-h-[50vh] items-center justify-center p-8 text-center">
      <div>
        <p className="font-serif text-2xl text-coffee-900">Loading admin panel...</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Syncing menu data and workspace settings.
        </p>
      </div>
    </div>
  );
}
