import { Text, Preview, Link } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { Button } from "./_components/Button";

export interface LaunchAnnouncementProps {
  firstName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}

export default function LaunchAnnouncement({ firstName, appUrl, unsubscribeUrl }: LaunchAnnouncementProps) {
  const name = firstName || "there";

  return (
    <Layout preview="Get Capital is live. Come take a look.">
      <Preview>Get Capital is live. Come take a look.</Preview>
      <Text style={heading}>It's live</Text>
      <Text style={body}>
        Hi <strong>{name}</strong>, Get Capital is now open. You can browse
        listings, get a valuation for your business, and connect directly with
        verified buyers.
      </Text>
      <Text style={body}>
        You signed up to be notified — so here we are. Thanks for your early
        interest.
      </Text>
      <Button href={appUrl}>Get started</Button>
      <Text style={unsub}>
        You're receiving this because you signed up at get-capital.com.au.{" "}
        <Link href={unsubscribeUrl} style={unsubLink}>Unsubscribe</Link>
      </Text>
    </Layout>
  );
}

const heading: React.CSSProperties = { fontSize: "24px", fontWeight: 700, color: "#000000", margin: "0 0 32px 0" };
const body: React.CSSProperties = { fontSize: "16px", lineHeight: "1.6", color: "#000000", margin: "0 0 16px 0" };
const unsub: React.CSSProperties = { fontSize: "12px", color: "#999999", margin: "32px 0 0 0" };
const unsubLink: React.CSSProperties = { color: "#999999", textDecoration: "underline" };
