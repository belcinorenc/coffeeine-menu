import { updateSettingsAction } from "@/app/admin/actions";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SetupNotice } from "@/components/admin/setup-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSettings } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary">Cafe ayarları</Badge>
        <h1 className="font-serif text-4xl text-coffee-900">Marka ve iletişim bilgileri</h1>
        <p className="text-sm text-muted-foreground">
          Ana sayfa metinlerini, logoyu, sosyal medya ve iletişim bilgilerini buradan güncelleyin.
        </p>
      </div>

      {!isSupabaseConfigured() ? <SetupNotice /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Genel ayarlar</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSettingsAction} className="grid gap-4 lg:grid-cols-2">
            <Field label="Cafe adı" name="cafe_name" defaultValue={settings.cafe_name} required />
            <ImageUploadField
              label="Logo"
              name="logo_url"
              folder="logos"
              defaultValue={settings.logo_url}
            />
            <Field label="Ana başlık" name="hero_title" defaultValue={settings.hero_title} required />
            <Field label="Instagram URL" name="instagram_url" defaultValue={settings.instagram_url ?? ""} />
            <Field label="Telefon" name="phone" defaultValue={settings.phone ?? ""} />
            <Field label="Çalışma saatleri" name="working_hours" defaultValue={settings.working_hours ?? ""} />
            <div className="lg:col-span-2">
              <Label htmlFor="hero_subtitle">Ana açıklama</Label>
              <Textarea id="hero_subtitle" name="hero_subtitle" defaultValue={settings.hero_subtitle} required />
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea id="address" name="address" defaultValue={settings.address ?? ""} />
            </div>
            <div className="lg:col-span-2 flex justify-end">
              <Button type="submit">Ayarları kaydet</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  name,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  name: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
