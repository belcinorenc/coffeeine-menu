import { createCategoryAction, deleteCategoryAction, moveCategoryAction, updateCategoryAction } from "@/app/admin/actions";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SetupNotice } from "@/components/admin/setup-notice";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategories } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary">Kategori yönetimi</Badge>
        <h1 className="font-serif text-4xl text-coffee-900">Kategoriler</h1>
        <p className="text-sm text-muted-foreground">
          Menü bölümlerini sıralayın, görünürlüğünü ayarlayın ve kategori görsellerini yönetin.
        </p>
      </div>

      {!isSupabaseConfigured() ? <SetupNotice /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Yeni kategori oluştur</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategoryAction} className="grid gap-4 md:grid-cols-2">
            <Field label="Kategori adı" name="name" placeholder="Sıcak Kahveler" required />
            <Field label="Kısa adres (slug)" name="slug" placeholder="sicak-kahveler" required />
            <ImageUploadField label="Kategori görseli" name="image_url" folder="categories" />
            <Field label="Sıra" name="sort_order" type="number" defaultValue="1" required />
            <div className="flex items-end gap-3 rounded-[24px] border border-coffee-200 bg-coffee-50/60 p-4 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded" />
                Yayında
              </label>
              <Button type="submit" className="ml-auto">
                Kategori ekle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {categories.length === 0 ? (
        <EmptyState
          title="Henüz kategori yok"
          description="Coffeeine QR menüsünü düzenlemek için ilk kategoriyi oluşturun."
        />
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="pt-6">
                <form action={updateCategoryAction} className="grid gap-4 lg:grid-cols-2">
                  <input type="hidden" name="id" value={category.id} />
                  <Field label="Kategori adı" name="name" defaultValue={category.name} required />
                  <Field label="Kısa adres (slug)" name="slug" defaultValue={category.slug} required />
                  <ImageUploadField
                    label="Kategori görseli"
                    name="image_url"
                    folder="categories"
                    defaultValue={category.image_url}
                  />
                  <Field
                    label="Sıra"
                    name="sort_order"
                    type="number"
                    defaultValue={String(category.sort_order)}
                    required
                  />
                  <div className="flex flex-wrap items-end gap-2 rounded-[24px] border border-coffee-200 bg-coffee-50/60 p-4 lg:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                      <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={category.is_active}
                        className="h-4 w-4 rounded"
                      />
                      Yayında
                    </label>
                    <Button type="submit">Kaydet</Button>
                  </div>
                </form>
                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={moveCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <input type="hidden" name="direction" value="up" />
                    <Button type="submit" variant="outline" size="sm">
                      Yukarı taşı
                    </Button>
                  </form>
                  <form action={moveCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <input type="hidden" name="direction" value="down" />
                    <Button type="submit" variant="outline" size="sm">
                      Aşağı taşı
                    </Button>
                  </form>
                  <ConfirmActionForm
                    action={deleteCategoryAction}
                    message={`"${category.name}" kategorisi ve içindeki ürünler silinsin mi? Bu işlem geri alınamaz.`}
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <Button type="submit" variant="destructive" size="sm">
                      Sil
                    </Button>
                  </ConfirmActionForm>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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
