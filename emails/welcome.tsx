import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { Button } from "./_components/Button";

export interface WelcomeProps {
  firstName: string;
  appUrl: string;
}

export default function Welcome({ firstName, appUrl }: WelcomeProps) {
  return (
    <Layout preview={`Welcome to Get Capital, ${firstName}.`}>
      <Preview>Welcome to Get Capital, {firstName}.</Preview>
      <Text style={heading}>Welcome to Get Capital</Text>
      <Text style={body}>
        Hi <strong>{firstName}</strong>, thanks for creating an account. You can
        now browse the marketplace and manage your dashboard.
      </Text>
      <Text style={body}>
        We're building Australia's marketplace for buying and selling small
        businesses. New features are launching soon — we'll keep you posted.
      </Text>
      <Button href={`${appUrl}/dashboard`}>Go to dashboard</Button>
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
