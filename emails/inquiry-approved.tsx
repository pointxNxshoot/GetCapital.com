import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { Button } from "./_components/Button";

export interface InquiryApprovedProps {
  buyerFirstName: string;
  listingAddress: string;
  accessDescription: string;
  listingId: string;
  appUrl: string;
}

export default function InquiryApproved({ buyerFirstName, listingAddress, accessDescription, listingId, appUrl }: InquiryApprovedProps) {
  return (
    <Layout preview={`Your inquiry on ${listingAddress} was approved.`}>
      <Preview>Your inquiry on {listingAddress} was approved.</Preview>
      <Text style={heading}>Your inquiry was approved</Text>
      <Text style={body}>
        Hi <strong>{buyerFirstName}</strong>, the owner of{" "}
        <strong>{listingAddress}</strong> has approved your inquiry. You now
        have access to {accessDescription}.
      </Text>
      <Button href={`${appUrl}/listings/${listingId}`}>View listing details</Button>
    </Layout>
  );
}

const heading: React.CSSProperties = { fontSize: "24px", fontWeight: 700, color: "#000000", margin: "0 0 32px 0" };
const body: React.CSSProperties = { fontSize: "16px", lineHeight: "1.6", color: "#000000", margin: "0 0 16px 0" };
