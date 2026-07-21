import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of CineFind.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="January 15, 2026"
      sections={[
        {
          heading: "Acceptance of Terms",
          body: [
            "By accessing or using CineFind, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.",
          ],
        },
        {
          heading: "Use of the Service",
          body: [
            "CineFind provides movie and TV discovery information sourced from TMDB. Content is provided for informational purposes only.",
            "You agree not to misuse the service, including attempting to disrupt service availability, scrape data at abusive volumes, or circumvent access controls.",
          ],
        },
        {
          heading: "Accounts",
          body: [
            "Signing in uses TMDB's official authentication flow. Your TMDB account credentials are never handled or stored by CineFind directly.",
          ],
        },
        {
          heading: "Content Disclaimer",
          body: [
            "Movie, TV, and people data, including ratings, images, and availability, is provided by TMDB and third-party sources and may not always be accurate or up to date.",
          ],
        },
        {
          heading: "Limitation of Liability",
          body: [
            "CineFind is provided \"as is\" without warranties of any kind. We are not liable for any damages arising from your use of the service.",
          ],
        },
        {
          heading: "Changes to These Terms",
          body: ["We may update these terms from time to time. Continued use of the service constitutes acceptance of the updated terms."],
        },
      ]}
    />
  );
}
