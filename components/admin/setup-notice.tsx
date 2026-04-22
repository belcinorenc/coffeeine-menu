import { AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SetupNotice() {
  return (
    <Card className="border-amber-200 bg-amber-50/80">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="rounded-full bg-amber-100 p-2 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-xl text-amber-900">Supabase kurulumu gerekli</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-amber-900/80">
          Şu anda menü demo Coffeeine verilerini gösteriyor. `.env.local` içine Supabase URL ve
          anon key değerlerini ekleyin, `supabase/` klasöründeki SQL dosyalarını çalıştırın; panel
          tamamen canlı hale gelir.
        </p>
      </CardContent>
    </Card>
  );
}
