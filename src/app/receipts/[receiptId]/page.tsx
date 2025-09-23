import { fetchReceiptById } from "@/actions/receipt";
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/layout/page-layout";
import ReceiptPageClient from "./_components/receipt-page-client";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  const { receiptId } = await params;
  const receipt = await fetchReceiptById(receiptId);

  return (
    <PageLayout>
      <PageHeader backHref="/receipts">
        <PageTitle>Receipt</PageTitle>
      </PageHeader>
      <PageContent>
        <ReceiptPageClient receipt={receipt} receiptId={receiptId} />
      </PageContent>
    </PageLayout>
  );
}
