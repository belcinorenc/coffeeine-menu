insert into public.categories (id, name, slug, sort_order, is_active)
values
  ('8d4c5550-5e7d-462b-b9b8-450721718603', 'Hot Coffees', 'hot-coffees', 1, true),
  ('32842c2c-a3db-4f46-b457-9e0686b07014', 'Iced Coffees', 'iced-coffees', 2, true),
  ('08bd8691-7df8-4c3f-bde7-7341ef79d155', 'Signature Drinks', 'signature-drinks', 3, true),
  ('cb4fd790-40f2-4d23-bef6-272d8d75c7ab', 'Desserts', 'desserts', 4, true),
  ('29dd7cb9-e273-44c8-b56d-7f9b37a98197', 'Breakfast', 'breakfast', 5, true)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.products (
  id,
  category_id,
  name,
  description,
  price,
  image_url,
  badge,
  is_available,
  is_active,
  sort_order
)
values
  ('11111111-1111-4111-8111-111111111111', '8d4c5550-5e7d-462b-b9b8-450721718603', 'Espresso', 'Rich crema, dark chocolate finish, served as a precise double shot.', 95, null, 'Bestseller', true, true, 1),
  ('11111111-1111-4111-8111-111111111112', '8d4c5550-5e7d-462b-b9b8-450721718603', 'Americano', 'Balanced and clean with a long, smooth finish.', 110, null, null, true, true, 2),
  ('11111111-1111-4111-8111-111111111113', '8d4c5550-5e7d-462b-b9b8-450721718603', 'Cappuccino', 'Silky microfoam over a bold espresso base.', 145, null, 'Bestseller', true, true, 3),
  ('11111111-1111-4111-8111-111111111114', '8d4c5550-5e7d-462b-b9b8-450721718603', 'Latte', 'Creamy milk texture with a soft caramel note.', 155, null, null, true, true, 4),
  ('11111111-1111-4111-8111-111111111115', '8d4c5550-5e7d-462b-b9b8-450721718603', 'Flat White', 'A stronger milk coffee with velvety body and depth.', 155, null, 'New', true, true, 5),
  ('22222222-2222-4222-8222-222222222221', '32842c2c-a3db-4f46-b457-9e0686b07014', 'Iced Americano', 'Bright espresso poured over clear ice for a crisp finish.', 125, null, null, true, true, 1),
  ('22222222-2222-4222-8222-222222222222', '32842c2c-a3db-4f46-b457-9e0686b07014', 'Iced Latte', 'A refreshing balance of espresso and cold milk.', 155, null, 'Bestseller', true, true, 2),
  ('22222222-2222-4222-8222-222222222223', '32842c2c-a3db-4f46-b457-9e0686b07014', 'Cold Brew', 'Slow-steeped for 18 hours with cocoa and hazelnut notes.', 165, null, 'Seasonal', true, true, 3),
  ('22222222-2222-4222-8222-222222222224', '32842c2c-a3db-4f46-b457-9e0686b07014', 'Iced Mocha', 'Espresso, milk, and dark chocolate over ice.', 175, null, null, false, true, 4),
  ('33333333-3333-4333-8333-333333333331', '08bd8691-7df8-4c3f-bde7-7341ef79d155', 'Spanish Latte', 'Condensed milk sweetness layered into a smooth espresso latte.', 175, null, 'Bestseller', true, true, 1),
  ('33333333-3333-4333-8333-333333333332', '08bd8691-7df8-4c3f-bde7-7341ef79d155', 'Caramel Cream Cold Brew', 'Cold brew crowned with salted caramel cream foam.', 190, null, 'Seasonal', true, true, 2),
  ('44444444-4444-4444-8444-444444444441', 'cb4fd790-40f2-4d23-bef6-272d8d75c7ab', 'San Sebastian Cheesecake', 'Creamy center, caramelized top, served chilled.', 210, null, 'Bestseller', true, true, 1),
  ('44444444-4444-4444-8444-444444444442', 'cb4fd790-40f2-4d23-bef6-272d8d75c7ab', 'Brownie', 'Dense dark chocolate brownie with a glossy finish.', 145, null, null, true, true, 2),
  ('44444444-4444-4444-8444-444444444443', 'cb4fd790-40f2-4d23-bef6-272d8d75c7ab', 'Cookie', 'Large bakery-style cookie with brown butter aroma.', 95, null, 'New', true, true, 3),
  ('55555555-5555-4555-8555-555555555551', '29dd7cb9-e273-44c8-b56d-7f9b37a98197', 'Avocado Toast', 'Sourdough, smashed avocado, feta, chili oil, and herbs.', 245, null, null, true, true, 1),
  ('55555555-5555-4555-8555-555555555552', '29dd7cb9-e273-44c8-b56d-7f9b37a98197', 'Croissant', 'Buttery, flaky, and baked fresh each morning.', 110, null, null, true, true, 2),
  ('55555555-5555-4555-8555-555555555553', '29dd7cb9-e273-44c8-b56d-7f9b37a98197', 'Grilled Sandwich', 'Mozzarella, smoked turkey, tomato, and pesto on toasted bread.', 235, null, null, true, true, 3)
on conflict (id) do update
set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  badge = excluded.badge,
  is_available = excluded.is_available,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.settings (
  id,
  cafe_name,
  logo_url,
  hero_title,
  hero_subtitle,
  instagram_url,
  phone,
  address,
  working_hours
)
values (
  1,
  'Coffeeine',
  null,
  'Coffee, crafted with calm precision.',
  'From velvety flat whites to slow mornings with cheesecake, Coffeeine brings a refined neighborhood cafe experience to every table scan.',
  'https://instagram.com/coffeeine.cafe',
  '+90 212 555 01 47',
  'Moda Caddesi No:18, Kadikoy / Istanbul',
  'Her gun 08:00 - 22:30'
)
on conflict (id) do update
set
  cafe_name = excluded.cafe_name,
  logo_url = excluded.logo_url,
  hero_title = excluded.hero_title,
  hero_subtitle = excluded.hero_subtitle,
  instagram_url = excluded.instagram_url,
  phone = excluded.phone,
  address = excluded.address,
  working_hours = excluded.working_hours;
