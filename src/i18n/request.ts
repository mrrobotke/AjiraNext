import type { Messages } from "./messages/en";

export async function getMessages(locale: string): Promise<Messages> {
  const mod =
    locale === "sw"
      ? await import("./messages/sw")
      : await import("./messages/en");
  return mod.default;
}
