import { createCategoryAction, deleteCategoryAction, moveCategoryAction, updateCategoryAction } from "@/app/admin/actions";
import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
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
        <Badge variant="secondary">Category management</Badge>
        <h1 className="font-serif text-4xl text-coffee-900">Categories</h1>
      </div>

      {!isSupabaseConfigured() ? <SetupNotice /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategoryAction} className="grid gap-4 md:grid-cols-4">
            <Field label="Name" name="name" placeholder="Hot Coffees" required />
            <Field label="Slug" name="slug" placeholder="hot-coffees" required />
            <Field label="Sort order" name="sort_order" type="number" defaultValue="1" required />
            <div className="flex items-end gap-3 rounded-[24px] border border-coffee-200 bg-coffee-50/60 p-4">
              <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded" />
                Active
              </label>
              <Button type="submit" className="ml-auto">
                Add category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first menu category to start structuring the Coffeeine QR menu."
        />
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="pt-6">
                <form action={updateCategoryAction} className="grid gap-4 lg:grid-cols-[1.2fr_1fr_140px_auto]">
                  <input type="hidden" name="id" value={category.id} />
                  <Field label="Name" name="name" defaultValue={category.name} required />
                  <Field label="Slug" name="slug" defaultValue={category.slug} required />
                  <Field
                    label="Sort order"
                    name="sort_order"
                    type="number"
                    defaultValue={String(category.sort_order)}
                    required
                  />
                  <div className="flex flex-wrap items-end gap-2 rounded-[24px] border border-coffee-200 bg-coffee-50/60 p-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-coffee-900">
                      <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={category.is_active}
                        className="h-4 w-4 rounded"
                      />
                      Active
                    </label>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={moveCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <input type="hidden" name="direction" value="up" />
                    <Button type="submit" variant="outline" size="sm">
                      Move up
                    </Button>
                  </form>
                  <form action={moveCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <input type="hidden" name="direction" value="down" />
                    <Button type="submit" variant="outline" size="sm">
                      Move down
                    </Button>
                  </form>
                  <ConfirmActionForm
                    action={deleteCategoryAction}
                    message={`Delete "${category.name}" and all products inside it? This cannot be undone.`}
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <Button type="submit" variant="destructive" size="sm">
                      Delete
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
