import {
  createProductAction,
  deleteProductAction,
  moveProductAction,
  updateProductAction
} from "@/app/admin/actions";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SetupNotice } from "@/components/admin/setup-notice";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCategories, getProducts } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";
import type { Category, ProductWithCategory } from "@/lib/types";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.toLowerCase() : "";
  const categoryFilter = typeof params.category === "string" ? params.category : "all";

  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search) ||
      product.badge?.toLowerCase().includes(search);

    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const groupedProducts = categories
    .map((category) => ({
      category,
      products: filteredProducts
        .filter((product) => product.category_id === category.id)
        .sort((a, b) => a.sort_order - b.sort_order)
    }))
    .filter((group) => group.products.length > 0);

  const uncategorizedProducts = filteredProducts.filter(
    (product) => !categories.some((category) => category.id === product.category_id)
  );

  const productGroups = [
    ...groupedProducts,
    ...(uncategorizedProducts.length
      ? [{ category: null, products: uncategorizedProducts }]
      : [])
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-5 p-5 lg:grid-cols-[280px_1fr] lg:items-end">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coffee-800 font-serif text-2xl text-white">
              C
            </div>
            <div>
              <Badge variant="secondary">Ürün yönetimi</Badge>
              <h1 className="mt-2 font-serif text-3xl text-coffee-900">Ürünler</h1>
              <p className="text-sm text-muted-foreground">{filteredProducts.length} ürün gösteriliyor</p>
            </div>
          </div>

          <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <TextField label="Ürün ara" name="search" defaultValue={search} placeholder="Latte, tatlı, kahvaltı..." />
            <SelectField
              label="Kategori"
              name="category"
              defaultValue={categoryFilter}
              options={[
                { label: "Tüm kategoriler", value: "all" },
                ...categories.map((category) => ({ label: category.name, value: category.id }))
              ]}
            />
            <div className="flex items-end">
              <Button type="submit" variant="outline" className="w-full">
                Filtrele
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {!isSupabaseConfigured() ? <SetupNotice /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Yeni ürün ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProductAction} className="grid gap-4 lg:grid-cols-2">
            <TextField label="Ürün adı" name="name" placeholder="Spanish Latte" required />
            <SelectField
              label="Kategori"
              name="category_id"
              required
              options={categories.map((category) => ({
                label: category.name,
                value: category.id
              }))}
            />
            <TextField label="Fiyat (TRY)" name="price" type="number" step="1" placeholder="175" required />
            <TextField label="Sıra" name="sort_order" type="number" defaultValue="1" required />
            <ImageUploadField label="Ürün görseli" name="image_url" folder="products" />
            <TextField label="Etiket" name="badge" placeholder="Yeni / Çok Satan / Sezonluk" />
            <div className="lg:col-span-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" name="description" placeholder="Kısa menü açıklaması" />
            </div>
            <div className="flex flex-wrap gap-4 rounded-[24px] border border-coffee-200 bg-coffee-50/60 p-4 lg:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                <input type="checkbox" name="is_available" defaultChecked className="h-4 w-4 rounded" />
                Stokta
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded" />
                Yayında
              </label>
              <Button type="submit" className="ml-auto">
                Ürün ekle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Eşleşen ürün yok"
          description="Farklı bir arama deneyin veya Coffeeine menüsüne yeni bir ürün ekleyin."
        />
      ) : (
        <div className="space-y-6">
          {productGroups.map((group) => (
            <section key={group.category?.id ?? "uncategorized"} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-coffee-200 bg-white/70 px-5 py-4 shadow-sm">
                <div>
                  <h2 className="font-serif text-2xl text-coffee-900">
                    {group.category?.name ?? "Kategorisiz"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {group.products.length} ürün
                  </p>
                </div>
                <Badge variant="secondary">Menü sırasına göre</Badge>
              </div>

              <div className="grid gap-4">
                {group.products.map((product) => (
                  <ProductEditor key={product.id} product={product} categories={categories} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductEditor({
  product,
  categories
}: {
  product: ProductWithCategory;
  categories: Category[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.category?.name ?? "Kategorisiz"} - {formatCurrency(product.price)}
            </p>
          </div>
          <div className="flex gap-2">
            {!product.is_available ? <Badge variant="muted">Stokta yok</Badge> : null}
            {!product.is_active ? <Badge variant="warning">Gizli</Badge> : null}
            {product.badge ? <Badge variant="secondary">{product.badge}</Badge> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={updateProductAction} className="grid gap-4 lg:grid-cols-2">
          <input type="hidden" name="id" value={product.id} />
          <TextField label="Ürün adı" name="name" defaultValue={product.name} required />
          <SelectField
            label="Kategori"
            name="category_id"
            defaultValue={product.category_id}
            required
            options={categories.map((category) => ({
              label: category.name,
              value: category.id
            }))}
          />
          <TextField
            label="Fiyat (TRY)"
            name="price"
            type="number"
            step="1"
            defaultValue={String(product.price)}
            required
          />
          <TextField
            label="Sıra"
            name="sort_order"
            type="number"
            defaultValue={String(product.sort_order)}
            required
          />
          <ImageUploadField
            label="Ürün görseli"
            name="image_url"
            folder="products"
            defaultValue={product.image_url}
          />
          <TextField
            label="Etiket"
            name="badge"
            defaultValue={product.badge ?? ""}
            placeholder="Yeni / Çok Satan / Sezonluk"
          />
          <div className="lg:col-span-2">
            <Label htmlFor={`description-${product.id}`}>Açıklama</Label>
            <Textarea
              id={`description-${product.id}`}
              name="description"
              defaultValue={product.description ?? ""}
              placeholder="Kısa menü açıklaması"
            />
          </div>
          <div className="flex flex-wrap gap-4 rounded-[24px] border border-coffee-200 bg-coffee-50/60 p-4 lg:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
              <input
                type="checkbox"
                name="is_available"
                defaultChecked={product.is_available}
                className="h-4 w-4 rounded"
              />
              Stokta
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={product.is_active}
                className="h-4 w-4 rounded"
              />
              Yayında
            </label>
            <Button type="submit" className="ml-auto">
              Değişiklikleri kaydet
            </Button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <form action={moveProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="category_id" value={product.category_id} />
            <input type="hidden" name="direction" value="up" />
            <Button type="submit" variant="outline" size="sm">
              Yukarı taşı
            </Button>
          </form>
          <form action={moveProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="category_id" value={product.category_id} />
            <input type="hidden" name="direction" value="down" />
            <Button type="submit" variant="outline" size="sm">
              Aşağı taşı
            </Button>
          </form>
          <ConfirmActionForm
            action={deleteProductAction}
            message={`"${product.name}" silinsin mi? Bu işlem geri alınamaz.`}
          >
            <input type="hidden" name="id" value={product.id} />
            <Button type="submit" variant="destructive" size="sm">
              Sil
            </Button>
          </ConfirmActionForm>
        </div>
      </CardContent>
    </Card>
  );
}

function TextField({
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

function SelectField({
  label,
  name,
  options,
  ...props
}: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        className="flex h-11 w-full rounded-2xl border border-coffee-200 bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-500"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
