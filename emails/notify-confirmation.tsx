import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";

export interface NotifyConfirmationProps {
  email: string;
  source: "valuation" | "listings";
}

const sourceLabels = {
  valuation: "Valuation Tool",
  listings: "Marketplace Listings",
};

export default function NotifyConfirmation({ email, source }: NotifyConfirmationProps) {
  const label = sourceLabels[source];

  return (
    <Layout preview={`You'll be the first to know when ${label} goes live.`}>
      <Preview>You'll be the first to know when {label} goes live.</Preview>
      <Text style={heading}>You're on the list</Text>
      <Text style={body}>
        We've added <strong>{email}</strong> to our early access list for{" "}
        <strong>{label}</strong>.
      </Text>
      <Text style={body}>
        You'll be the first to know when it goes live. In the meantime, feel
        free to reply directly to this email if you have any questions.
      </Text>
    </Layout>
  );
}

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#000000",
  margin: "0 0 32px 0",
};

const body: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#000000",
  margin: "0 0 16px 0",
};
