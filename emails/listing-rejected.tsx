import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { DataBlock } from "./_components/DataBlock";
import { Button } from "./_components/Button";

export interface ListingRejectedProps {
  firstName: string;
  listingAddress: string;
  reason: string;
  listingId: string;
  appUrl: string;
}

export default function ListingRejected({ firstName, listingAddress, reason, listingId, appUrl }: ListingRejectedProps) {
  return (
    <Layout preview="An update on your listing submission.">
      <Preview>An update on your listing submission.</Preview>
      <Text style={heading}>Update on your listing</Text>
      <Text style={body}>
        Hi <strong>{firstName}</strong>, we weren't able to approve your listing
        for <strong>{listingAddress}</strong> as submitted.
      </Text>
      <DataBlock>{reason}</DataBlock>
      <Text style={body}>
        You can edit your listing and resubmit for review.
      </Text>
      <Button href={`${appUrl}/listings/${listingId}/edit`}>Edit listing</Button>
    </Layout>
  );
}

const heading: React.CSSProperties = { fontSize: "24px", fontWeight: 700, color: "#000000", margin: "0 0 32px 0" };
const body: React.CSSProperties = { fontSize: "16px", lineHeight: "1.6", color: "#000000", margin: "0 0 16px 0" };
