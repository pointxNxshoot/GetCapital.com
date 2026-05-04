import { Text, Preview } from "@react-email/components";
import { Layout } from "./_components/Layout";
import { DataBlock } from "./_components/DataBlock";

export interface ListingSubmittedProps {
  firstName: string;
  listingAddress: string;
  listingId: string;
}

export default function ListingSubmitted({ firstName, listingAddress }: ListingSubmittedProps) {
  return (
    <Layout preview="Your listing has been submitted for review.">
      <Preview>Your listing has been submitted for review.</Preview>
      <Text style={heading}>Your listing has been submitted</Text>
      <Text style={body}>
        Hi <strong>{firstName}</strong>, we've received your listing and it's
        now in our review queue.
      </Text>
      <DataBlock>{listingAddress}</DataBlock>
      <Text style={body}>
        Review usually takes 1-2 business days. We'll email you as soon as
        it's approved.
      </Text>
    </Layout>
  );
}

const heading: React.CSSProperties = { fontSize: "24px", fontWeight: 700, color: "#000000", margin: "0 0 32px 0" };
const body: React.CSSProperties = { fontSize: "16px", lineHeight: "1.6", color: "#000000", margin: "0 0 16px 0" };
