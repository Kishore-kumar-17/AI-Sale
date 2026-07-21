import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { Proposal } from "@/generated/prisma/client";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#1a1a1a" },
  title: { fontSize: 20, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 11, marginBottom: 20, color: "#555555" },
  sectionTitle: { fontSize: 13, marginTop: 16, marginBottom: 6, fontFamily: "Helvetica-Bold" },
  paragraph: { marginBottom: 4, lineHeight: 1.4 },
  bullet: { marginBottom: 3, lineHeight: 1.4 },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <Text key={i} style={styles.bullet}>
          {"• "}
          {item}
        </Text>
      ))}
    </View>
  );
}

function ProposalDocument({ proposal, businessName }: { proposal: Proposal; businessName: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Proposal for {businessName}</Text>
        <Text style={styles.subtitle}>Prepared by Nexivra Tech</Text>

        <Section title="Introduction">
          <Text style={styles.paragraph}>{proposal.introduction}</Text>
        </Section>
        <Section title="Understanding Your Business">
          <Text style={styles.paragraph}>{proposal.understandingClient}</Text>
        </Section>
        <Section title="Problem Statement">
          <Text style={styles.paragraph}>{proposal.problemStatement}</Text>
        </Section>
        <Section title="Our Solution">
          <Text style={styles.paragraph}>{proposal.solution}</Text>
        </Section>
        <Section title="Features">
          <BulletList items={proposal.features} />
        </Section>
        <Section title="Timeline">
          <BulletList items={proposal.timeline} />
        </Section>
        <Section title="Pricing">
          {proposal.pricing.split("\n").map((line, i) => (
            <Text key={i} style={styles.paragraph}>
              {line}
            </Text>
          ))}
        </Section>
        <Section title="Deliverables">
          <BulletList items={proposal.deliverables} />
        </Section>
        <Section title="Support">
          <Text style={styles.paragraph}>{proposal.support}</Text>
        </Section>
        <Section title="Terms & Conditions">
          <BulletList items={proposal.terms} />
        </Section>
      </Page>
    </Document>
  );
}

export async function renderProposalPdf(proposal: Proposal, businessName: string): Promise<Buffer> {
  return renderToBuffer(<ProposalDocument proposal={proposal} businessName={businessName} />);
}
