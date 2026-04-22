export default function AdminLoading() {
  return (
    <div className="surface flex min-h-[50vh] items-center justify-center p-8 text-center">
      <div>
        <p className="font-serif text-2xl text-coffee-900">Yönetim paneli yükleniyor...</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Menü verileri ve cafe ayarları hazırlanıyor.
        </p>
      </div>
    </div>
  );
}
