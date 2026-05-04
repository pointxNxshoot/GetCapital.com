import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";

export interface ContactAutoReplyProps {
  firstName: string;
}

export default function ContactAutoReply({ firstName }: ContactAutoReplyProps) {
  return (
    <Layout preview="We got your message and will respond within one business day.">
      <Preview>We got your message and will respond within one business day.</Preview>
      <Text style={heading}>We got your message</Text>
      <Text style={body}>
        Hi <strong>{firstName}</strong>, thanks for reaching out. We'll get back
        to you within one business day.
      </Text>
      <Text style={body}>
        If it's urgent, reply directly to this email.
      </Text>
      <Text style={signoff}>
        Alex Gorman
        <br />
        Founder, Get Capital
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

const signoff: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#000000",
  margin: "32px 0 0 0",
};
