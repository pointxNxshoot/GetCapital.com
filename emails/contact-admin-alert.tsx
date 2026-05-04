import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { DataBlock } from "./_components/DataBlock";

export interface ContactAdminAlertProps {
  name: string;
  email: string;
  message: string;
}

export default function ContactAdminAlert({ name, email, message }: ContactAdminAlertProps) {
  return (
    <Layout preview={`Contact form submission from ${name}`}>
      <Preview>Contact form submission from {name}</Preview>
      <Text style={heading}>Contact form: {name}</Text>
      <Text style={detail}><strong>Name:</strong> {name}</Text>
      <Text style={detail}><strong>Email:</strong> {email}</Text>
      <DataBlock>{message}</DataBlock>
    </Layout>
  );
}

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#000000",
  margin: "0 0 32px 0",
};

const detail: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#666666",
  margin: "0 0 8px 0",
};
