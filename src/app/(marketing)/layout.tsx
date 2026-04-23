import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { getUser, getUserRole } from "@/lib/auth";
import { getPortalForRole } from "@/lib/rbac";
import { getMarketingSeoData } from "@/lib/seo";
import { getMessages } from "@/i18n/request";
import { I18nProvider } from "@/i18n/provider";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { MarketingPageTemplate } from "@/design-system/templates/MarketingPageTemplate";
import { MobileMarketingTemplate } from "@/design-system/templates/MobileMarketingTemplate";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, role, seoData] = await Promise.all([
    getUser(),
    getUserRole(),
    getMarketingSeoData(),
  ]);

  const dashboardHref = role ? getPortalForRole(role) : null;

  const cookieStore = await cookies();
  const locale = cookieStore.get("aj-locale")?.value ?? "en";
  const messages = await getMessages(locale);

  return (
    <I18nProvider messages={messages} locale={locale}>
      {/* Desktop */}
      <div className="hidden md:block">
        <MarketingPageTemplate user={user} dashboardHref={dashboardHref}>
          {children}
        </MarketingPageTemplate>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <MobileMarketingTemplate user={user} dashboardHref={dashboardHref}>
          {children}
        </MobileMarketingTemplate>
      </div>

      <Analytics />
      <PageViewTracker gaId={seoData.ga4MeasurementId} />
    </I18nProvider>
  );
}
