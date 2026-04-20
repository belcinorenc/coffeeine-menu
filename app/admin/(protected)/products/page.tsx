import {
  createProductAction,
  deleteProductAction,
  moveProductAction,
  updateProductAction
} from "@/app/admin/actions";
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
      product.description?.toLowerCase().includes(search);

    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary">Product management</Badge>
        <h1 className="font-serif text-4xl text-coffee-900">Products</h1>
      </div>

      {!isSupabaseConfigured() ? <SetupNotice /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Add product</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProductAction} className="grid gap-4 lg:grid-cols-2">
            <TextField label="Product name" name="name" placeholder="Spanish Latte" required />
            <SelectField label="Category" name="category_id" required options={categories.map((category) => ({
              label: category.name,
              value: category.id
            }))} />
            <TextField label="Price (TRY)" name="price" type="number" step="1" placeholder="175" required />
            <TextField label="Sort order" name="sort_order" type="number" defaultValue="1" required />
            <TextField label="Image URL" name="image_url" placeholder="https://..." />
            <TextField label="Badge" name="badge" placeholder="New / Bestseller / Seasonal" />
            <div className="lg:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Short menu description" />
            </div>
            <div className="flex flex-wrap gap-4 rounded-[24px] border border-coffee-200 bg-coffee-50/60 p-4 lg:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                <input type="checkbox" name="is_available" defaultChecked className="h-4 w-4 rounded" />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded" />
                Active
              </label>
              <Button type="submit" className="ml-auto">
                Create product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
            <TextField label="Search" name="search" defaultValue={search} placeholder="Search by name or description" />
            <SelectField
              label="Category filter"
              name="category"
              defaultValue={categoryFilter}
              options={[
                { label: "All categories", value: "all" },
                ...categories.map((category) => ({ label: category.name, value: category.id }))
              ]}
            />
            <div className="flex items-end">
              <Button type="submit" variant="outline" className="w-full">
                Filter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products match"
          description="Try a different search or add a new menu item for Coffeeine."
        />
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.category?.name ?? "Uncategorized"} • {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!product.is_available ? <Badge variant="muted">Unavailable</Badge> : null}
                    {!product.is_active ? <Badge variant="warning">Hidden</Badge> : null}
                    {product.badge ? <Badge variant="secondary">{product.badge}</Badge> : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form action={updateProductAction} className="grid gap-4 lg:grid-cols-2">
                  <input type="hidden" name="id" value={product.id} />
                  <TextField label="Product name" name="name" defaultValue={product.name} required />
                  <SelectField
                    label="Category"
                    name="category_id"
                    defaultValue={product.category_id}
                    required
                    options={categories.map((category) => ({
                      label: category.name,
                      value: category.id
                    }))}
                  />
                  <TextField
                    label="Price (TRY)"
                    name="price"
                    type="number"
                    step="1"
                    defaultValue={String(product.price)}
                    required
                  />
                  <TextField
                    label="Sort order"
                    name="sort_order"
                    type="number"
                    defaultValue={String(product.sort_order)}
                    required
                  />
                  <TextField
                    label="Image URL"
                    name="image_url"
                    defaultValue={product.image_url ?? ""}
                    placeholder="https://..."
                  />
                  <TextField
                    label="Badge"
                    name="badge"
                    defaultValue={product.badge ?? ""}
                    placeholder="New / Bestseller / Seasonal"
                  />
                  <div className="lg:col-span-2">
                    <Label htmlFor={`description-${product.id}`}>Description</Label>
                    <Textarea
                      id={`description-${product.id}`}
                      name="description"
                      defaultValue={product.description ?? ""}
                      placeholder="Short menu description"
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
                      Available
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                      <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={product.is_active}
                        className="h-4 w-4 rounded"
                      />
                      Active
                    </label>
                    <Button type="submit" className="ml-auto">
                      Save changes
                    </Button>
                  </div>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={moveProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="category_id" value={product.category_id} />
                    <input type="hidden" name="direction" value="up" />
                    <Button type="submit" variant="outline" size="sm">
                      Move up
                    </Button>
                  </form>
                  <form action={moveProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="category_id" value={product.category_id} />
                    <input type="hidden" name="direction" value="down" />
                    <Button type="submit" variant="outline" size="sm">
                      Move down
                    </Button>
                  </form>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <Button type="submit" variant="destructive" size="sm">
                      Delete
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
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
