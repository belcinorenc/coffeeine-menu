import type { PublicMenuData } from "@/lib/types";

const categoryIds = {
  hot: "8d4c5550-5e7d-462b-b9b8-450721718603",
  iced: "32842c2c-a3db-4f46-b457-9e0686b07014",
  signature: "08bd8691-7df8-4c3f-bde7-7341ef79d155",
  desserts: "cb4fd790-40f2-4d23-bef6-272d8d75c7ab",
  breakfast: "29dd7cb9-e273-44c8-b56d-7f9b37a98197"
};

export const demoMenuData: PublicMenuData = {
  settings: {
    id: 1,
    cafe_name: "Coffeeine",
    logo_url: null,
    hero_title: "Coffee, crafted with calm precision.",
    hero_subtitle:
      "From velvety flat whites to slow mornings with cheesecake, Coffeeine brings a refined neighborhood cafe experience to every table scan.",
    instagram_url: "https://instagram.com/coffeeine.cafe",
    phone: "+90 212 555 01 47",
    address: "Moda Caddesi No:18, Kadikoy / Istanbul",
    working_hours: "Her gun 08:00 - 22:30"
  },
  categories: [
    {
      id: categoryIds.hot,
      name: "Hot Coffees",
      slug: "hot-coffees",
      image_url: null,
      sort_order: 1,
      is_active: true,
      products: [
        {
          id: "001",
          category_id: categoryIds.hot,
          name: "Espresso",
          description: "Rich crema, dark chocolate finish, served as a precise double shot.",
          price: 95,
          image_url: null,
          badge: "Bestseller",
          is_available: true,
          is_active: true,
          sort_order: 1
        },
        {
          id: "002",
          category_id: categoryIds.hot,
          name: "Americano",
          description: "Balanced and clean with a long, smooth finish.",
          price: 110,
          image_url: null,
          badge: null,
          is_available: true,
          is_active: true,
          sort_order: 2
        },
        {
          id: "003",
          category_id: categoryIds.hot,
          name: "Cappuccino",
          description: "Silky microfoam over a bold espresso base.",
          price: 145,
          image_url: null,
          badge: "Bestseller",
          is_available: true,
          is_active: true,
          sort_order: 3
        },
        {
          id: "004",
          category_id: categoryIds.hot,
          name: "Latte",
          description: "Creamy milk texture with a soft caramel note.",
          price: 155,
          image_url: null,
          badge: null,
          is_available: true,
          is_active: true,
          sort_order: 4
        },
        {
          id: "005",
          category_id: categoryIds.hot,
          name: "Flat White",
          description: "A stronger milk coffee with velvety body and depth.",
          price: 155,
          image_url: null,
          badge: "New",
          is_available: true,
          is_active: true,
          sort_order: 5
        }
      ]
    },
    {
      id: categoryIds.iced,
      name: "Iced Coffees",
      slug: "iced-coffees",
      image_url: null,
      sort_order: 2,
      is_active: true,
      products: [
        {
          id: "006",
          category_id: categoryIds.iced,
          name: "Iced Americano",
          description: "Bright espresso poured over clear ice for a crisp finish.",
          price: 125,
          image_url: null,
          badge: null,
          is_available: true,
          is_active: true,
          sort_order: 1
        },
        {
          id: "007",
          category_id: categoryIds.iced,
          name: "Iced Latte",
          description: "A refreshing balance of espresso and cold milk.",
          price: 155,
          image_url: null,
          badge: "Bestseller",
          is_available: true,
          is_active: true,
          sort_order: 2
        },
        {
          id: "008",
          category_id: categoryIds.iced,
          name: "Cold Brew",
          description: "Slow-steeped for 18 hours with cocoa and hazelnut notes.",
          price: 165,
          image_url: null,
          badge: "Seasonal",
          is_available: true,
          is_active: true,
          sort_order: 3
        },
        {
          id: "009",
          category_id: categoryIds.iced,
          name: "Iced Mocha",
          description: "Espresso, milk, and dark chocolate over ice.",
          price: 175,
          image_url: null,
          badge: null,
          is_available: false,
          is_active: true,
          sort_order: 4
        }
      ]
    },
    {
      id: categoryIds.signature,
      name: "Signature Drinks",
      slug: "signature-drinks",
      image_url: null,
      sort_order: 3,
      is_active: true,
      products: [
        {
          id: "010",
          category_id: categoryIds.signature,
          name: "Spanish Latte",
          description: "Condensed milk sweetness layered into a smooth espresso latte.",
          price: 175,
          image_url: null,
          badge: "Bestseller",
          is_available: true,
          is_active: true,
          sort_order: 1
        },
        {
          id: "011",
          category_id: categoryIds.signature,
          name: "Caramel Cream Cold Brew",
          description: "Cold brew crowned with salted caramel cream foam.",
          price: 190,
          image_url: null,
          badge: "Seasonal",
          is_available: true,
          is_active: true,
          sort_order: 2
        }
      ]
    },
    {
      id: categoryIds.desserts,
      name: "Desserts",
      slug: "desserts",
      image_url: null,
      sort_order: 4,
      is_active: true,
      products: [
        {
          id: "012",
          category_id: categoryIds.desserts,
          name: "San Sebastian Cheesecake",
          description: "Creamy center, caramelized top, served chilled.",
          price: 210,
          image_url: null,
          badge: "Bestseller",
          is_available: true,
          is_active: true,
          sort_order: 1
        },
        {
          id: "013",
          category_id: categoryIds.desserts,
          name: "Brownie",
          description: "Dense dark chocolate brownie with a glossy finish.",
          price: 145,
          image_url: null,
          badge: null,
          is_available: true,
          is_active: true,
          sort_order: 2
        },
        {
          id: "014",
          category_id: categoryIds.desserts,
          name: "Cookie",
          description: "Large bakery-style cookie with brown butter aroma.",
          price: 95,
          image_url: null,
          badge: "New",
          is_available: true,
          is_active: true,
          sort_order: 3
        }
      ]
    },
    {
      id: categoryIds.breakfast,
      name: "Breakfast",
      slug: "breakfast",
      image_url: null,
      sort_order: 5,
      is_active: true,
      products: [
        {
          id: "015",
          category_id: categoryIds.breakfast,
          name: "Avocado Toast",
          description: "Sourdough, smashed avocado, feta, chili oil, and herbs.",
          price: 245,
          image_url: null,
          badge: null,
          is_available: true,
          is_active: true,
          sort_order: 1
        },
        {
          id: "016",
          category_id: categoryIds.breakfast,
          name: "Croissant",
          description: "Buttery, flaky, and baked fresh each morning.",
          price: 110,
          image_url: null,
          badge: null,
          is_available: true,
          is_active: true,
          sort_order: 2
        },
        {
          id: "017",
          category_id: categoryIds.breakfast,
          name: "Grilled Sandwich",
          description: "Mozzarella, smoked turkey, tomato, and pesto on toasted bread.",
          price: 235,
          image_url: null,
          badge: null,
          is_available: true,
          is_active: true,
          sort_order: 3
        }
      ]
    }
  ]
};
