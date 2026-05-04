import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";

const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

interface LayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function Layout({ preview, children }: LayoutProps) {
  const brandName = "Get Capital";
  const brandAddress = "Australia";

  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        <Container style={card}>
          {/* Logo placeholder — swap with real asset later */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="512" height="512" rx="80" fill="#0A0A0A" />
            <text
              x="256"
              y="256"
              fontFamily={fontFamily}
              fontSize="320"
              fontWeight="700"
              fill="#ffffff"
              textAnchor="middle"
              dominantBaseline="central"
            >
              G
            </text>
          </svg>

          <Section style={{ marginTop: "32px" }}>{children}</Section>

          <Hr style={divider} />

          <Text style={footer}>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </Text>
          <Text style={footer}>{brandAddress}</Text>
          <Text style={footer}>
            <Link href="https://get-capital.com.au" style={footerLink}>
              get-capital.com.au
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#fafafa",
  fontFamily,
  padding: "40px 0",
  margin: 0,
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #eaeaea",
  borderRadius: "8px",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "48px",
};

const divider: React.CSSProperties = {
  borderTop: "1px solid #eaeaea",
  margin: "32px 0",
};

const footer: React.CSSProperties = {
  fontSize: "14px",
  color: "#666666",
  lineHeight: "1.4",
  margin: "4px 0",
};

const footerLink: React.CSSProperties = {
  color: "#666666",
  textDecoration: "underline",
};
