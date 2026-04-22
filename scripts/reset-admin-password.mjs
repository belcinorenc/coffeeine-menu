import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_EMAIL = "belcinorencc@gmail.com";
const DEFAULT_PASSWORD = "Coffeeine2026!";

function loadEnvFile(fileName) {
  const envPath = resolve(process.cwd(), fileName);

  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const targetEmail = process.env.RESET_ADMIN_EMAIL ?? DEFAULT_EMAIL;
const newPassword = process.env.RESET_ADMIN_PASSWORD ?? DEFAULT_PASSWORD;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local.");
}

if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local. Add it locally from Supabase Project Settings > API. Never commit it."
  );
}

if (newPassword.length < 6) {
  throw new Error("RESET_ADMIN_PASSWORD must be at least 6 characters.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 1000
});

if (listError) {
  throw listError;
}

const user = usersData.users.find(
  (candidate) => candidate.email?.toLowerCase() === targetEmail.toLowerCase()
);

if (!user) {
  throw new Error(`No Supabase Auth user found for ${targetEmail}.`);
}

const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
  password: newPassword,
  email_confirm: true
});

if (updateError) {
  throw updateError;
}

console.log(`Password updated for ${targetEmail}.`);
console.log("You can now sign in with the new password.");
