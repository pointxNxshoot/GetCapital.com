import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { DataBlock } from "./_components/DataBlock";
import { Button } from "./_components/Button";

export interface ListingApprovedProps {
  firstName: string;
  listingAddress: string;
  listingId: string;
  appUrl: string;
}

export default function ListingApproved({ firstName, listingAddress, listingId, appUrl }: ListingApprovedProps) {
  return (
    <Layout preview="Your listing is now live on Get Capital.">
      <Preview>Your listing is now live on Get Capital.</Preview>
      <Text style={heading}>Your listing is live</Text>
      <Text style={body}>
        Hi <strong>{firstName}</strong>, your listing has been approved and is
        now live on the marketplace.
      </Text>
      <DataBlock>{listingAddress}</DataBlock>
      <Button href={`${appUrl}/listings/${listingId}`}>View listing</Button>
    </Layout>
  );
}

const heading: React.CSSProperties = { fontSize: "24px", fontWeight: 700, color: "#000000", margin: "0 0 32px 0" };
const body: React.CSSProperties = { fontSize: "16px", lineHeight: "1.6", color: "#000000", margin: "0 0 16px 0" };
