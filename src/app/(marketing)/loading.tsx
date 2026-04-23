import { Spinner } from "@/design-system/atoms/Spinner";

export default function MarketingLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
