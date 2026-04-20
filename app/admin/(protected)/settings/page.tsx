import { updateSettingsAction } from "@/app/admin/actions";
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
        <Badge variant="secondary">Cafe settings</Badge>
        <h1 className="font-serif text-4xl text-coffee-900">Brand and contact info</h1>
      </div>

      {!isSupabaseConfigured() ? <SetupNotice /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Global settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSettingsAction} className="grid gap-4 lg:grid-cols-2">
            <Field label="Cafe name" name="cafe_name" defaultValue={settings.cafe_name} required />
            <Field label="Logo URL" name="logo_url" defaultValue={settings.logo_url ?? ""} />
            <Field label="Hero title" name="hero_title" defaultValue={settings.hero_title} required />
            <Field label="Instagram URL" name="instagram_url" defaultValue={settings.instagram_url ?? ""} />
            <Field label="Phone" name="phone" defaultValue={settings.phone ?? ""} />
            <Field label="Working hours" name="working_hours" defaultValue={settings.working_hours ?? ""} />
            <div className="lg:col-span-2">
              <Label htmlFor="hero_subtitle">Hero subtitle</Label>
              <Textarea id="hero_subtitle" name="hero_subtitle" defaultValue={settings.hero_subtitle} required />
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" defaultValue={settings.address ?? ""} />
            </div>
            <div className="lg:col-span-2 flex justify-end">
              <Button type="submit">Save settings</Button>
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
