import { Section, Text } from "@react-email/components";

interface DataBlockProps {
  children: React.ReactNode;
}

export function DataBlock({ children }: DataBlockProps) {
  return (
    <Section style={block}>
      <Text style={text}>{children}</Text>
    </Section>
  );
}

const block: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  padding: "20px 24px",
  borderRadius: "4px",
  margin: "24px 0",
};

const text: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#000000",
  textAlign: "center" as const,
  margin: 0,
  fontFamily: "monospace",
};
