import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Services } from "@/components/marketing/services";
import { Process } from "@/components/marketing/process";
import { SocialProof } from "@/components/marketing/social-proof";
import { Cta } from "@/components/marketing/cta";

export const metadata: Metadata = {
  title: "agency@web — web design, SEO & digital strategy",
  description:
    "We build the web presence your business deserves: websites, SEO, and digital strategy that convert visitors into clients.",
};

export default function MarketingHome() {
  return (
    <main>
      <Hero />
      <Services />
      <Process />
      <SocialProof />
      <Cta />
    </main>
  );
}
