import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { config } from "../config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(config.supabase.url, config.supabase.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          // Swallow only the expected Server Component cookie-write error.
          if (msg.includes("cookies") && msg.includes("Server Component")) {
            return;
          }
          throw err;
        }
      },
    },
  });
}
