import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import type { Proposal } from "@/generated/prisma/client";

function sectionHeading(title: string) {
  return new Paragraph({ text: title, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } });
}

function bulletList(items: string[]) {
  return items.map((item) => new Paragraph({ text: item, bullet: { level: 0 } }));
}

function paragraphText(text: string) {
  return new Paragraph({ children: [new TextRun(text)], spacing: { after: 120 } });
}

export async function renderProposalDocx(proposal: Proposal, businessName: string): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: `Proposal for ${businessName}`, heading: HeadingLevel.TITLE }),
          new Paragraph({ text: "Prepared by Nexivra Tech", spacing: { after: 240 } }),

          sectionHeading("Introduction"),
          paragraphText(proposal.introduction),

          sectionHeading("Understanding Your Business"),
          paragraphText(proposal.understandingClient),

          sectionHeading("Problem Statement"),
          paragraphText(proposal.problemStatement),

          sectionHeading("Our Solution"),
          paragraphText(proposal.solution),

          sectionHeading("Features"),
          ...bulletList(proposal.features),

          sectionHeading("Timeline"),
          ...bulletList(proposal.timeline),

          sectionHeading("Pricing"),
          ...proposal.pricing.split("\n").map((line) => paragraphText(line)),

          sectionHeading("Deliverables"),
          ...bulletList(proposal.deliverables),

          sectionHeading("Support"),
          paragraphText(proposal.support),

          sectionHeading("Terms & Conditions"),
          ...bulletList(proposal.terms),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
