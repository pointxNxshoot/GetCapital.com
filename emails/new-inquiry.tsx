import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { DataBlock } from "./_components/DataBlock";
import { Button } from "./_components/Button";

export interface NewInquiryProps {
  ownerFirstName: string;
  listingAddress: string;
  buyerName: string;
  messageSnippet: string;
  inquiryId: string;
  appUrl: string;
}

export default function NewInquiry({ ownerFirstName, listingAddress, buyerName, messageSnippet, inquiryId, appUrl }: NewInquiryProps) {
  return (
    <Layout preview={`${buyerName} has inquired about ${listingAddress}.`}>
      <Preview>{buyerName} has inquired about {listingAddress}.</Preview>
      <Text style={heading}>New inquiry on {listingAddress}</Text>
      <Text style={body}>
        Hi <strong>{ownerFirstName}</strong>, someone has expressed interest in
        your listing.
      </Text>
      <DataBlock>
        {buyerName}: {messageSnippet}
      </DataBlock>
      <Button href={`${appUrl}/inquiries/${inquiryId}`}>Review inquiry</Button>
    </Layout>
  );
}

const heading: React.CSSProperties = { fontSize: "24px", fontWeight: 700, color: "#000000", margin: "0 0 32px 0" };
const body: React.CSSProperties = { fontSize: "16px", lineHeight: "1.6", color: "#000000", margin: "0 0 16px 0" };
