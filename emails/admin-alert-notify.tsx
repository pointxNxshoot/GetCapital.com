import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { DataBlock } from "./_components/DataBlock";

export interface AdminAlertNotifyProps {
  email: string;
  source: string;
  timestamp: string;
  userAgent?: string;
}

export default function AdminAlertNotify({ email, source, timestamp, userAgent }: AdminAlertNotifyProps) {
  return (
    <Layout preview={`New notify signup: ${email} (${source})`}>
      <Preview>New notify signup: {email} ({source})</Preview>
      <Text style={heading}>New signup</Text>
      <DataBlock>{email}</DataBlock>
      <Text style={detail}><strong>Source:</strong> {source}</Text>
      <Text style={detail}><strong>Time:</strong> {timestamp}</Text>
      {userAgent && <Text style={detail}><strong>UA:</strong> {userAgent}</Text>}
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
