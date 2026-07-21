import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CineFind collects, uses, and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="January 15, 2026"
      sections={[
        {
          heading: "Overview",
          body: [
            "CineFind (\"we\", \"us\") provides a movie and TV discovery service. This policy explains what information we collect, how we use it, and the choices you have.",
          ],
        },
        {
          heading: "Information We Collect",
          body: [
            "Account information: if you sign in with your TMDB account, we store a session identifier to keep you logged in. We do not store your TMDB password.",
            "Usage data: we may collect anonymized analytics such as pages visited and search queries to improve the service.",
            "Cookies: we use essential cookies for authentication and, where enabled, analytics cookies. See our Cookie Policy for details.",
          ],
        },
        {
          heading: "How We Use Information",
          body: [
            "To provide core functionality such as search, favorites, watchlists, and ratings.",
            "To maintain and improve the reliability, performance, and security of the service.",
          ],
        },
        {
          heading: "Third-Party Services",
          body: [
            "Movie, TV, and people data is provided by The Movie Database (TMDB) API. This product uses the TMDB API but is not endorsed or certified by TMDB.",
            "Watch provider availability is sourced via TMDB from JustWatch.",
          ],
        },
        {
          heading: "Your Rights",
          body: [
            "You may sign out at any time to remove your session cookie. You may request account data deletion by contacting us.",
          ],
        },
        {
          heading: "Contact",
          body: ["Questions about this policy can be directed to our support channels listed on the About page."],
        },
      ]}
    />
  );
}
