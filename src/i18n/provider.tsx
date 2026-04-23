"use client";

import { NextIntlClientProvider } from "next-intl";
import type { Messages } from "./messages/en";

export function I18nProvider({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: Messages;
  locale: string;
}) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
