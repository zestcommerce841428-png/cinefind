import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How CineFind uses cookies.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="January 15, 2026"
      sections={[
        {
          heading: "What Are Cookies",
          body: [
            "Cookies are small text files stored on your device that help websites function and remember information about your visit.",
          ],
        },
        {
          heading: "Cookies We Use",
          body: [
            "Essential: a secure, httpOnly session cookie is used to keep you signed in after connecting your TMDB account. This cookie is required for account features to work and cannot be disabled while staying signed in.",
            "Preferences: we may store your theme preference (light/dark) locally in your browser.",
          ],
        },
        {
          heading: "Managing Cookies",
          body: [
            "You can clear cookies at any time through your browser settings. Clearing the session cookie will sign you out of your account.",
          ],
        },
      ]}
    />
  );
}
