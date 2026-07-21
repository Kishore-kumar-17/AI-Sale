import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLeadById } from "@/services/leads";
import { getProposalByLeadId, recordProposalExport } from "@/services/proposals";
import { renderProposalPdf } from "@/lib/proposal-pdf";
import { renderProposalDocx } from "@/lib/proposal-docx";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "docx" ? "docx" : "pdf";

  const [lead, proposal] = await Promise.all([getLeadById(id), getProposalByLeadId(id)]);
  if (!lead || !proposal) {
    return new Response("Not found", { status: 404 });
  }

  const buffer =
    format === "docx"
      ? await renderProposalDocx(proposal, lead.businessName)
      : await renderProposalPdf(proposal, lead.businessName);

  await recordProposalExport(id, format === "docx" ? "DOCX" : "PDF");

  const safeName = lead.businessName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const contentType =
    format === "docx"
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/pdf";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="proposal-${safeName}.${format}"`,
    },
  });
}
