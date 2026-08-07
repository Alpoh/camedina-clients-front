import type { ReactNode } from "react";
import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
