import { fetchReceipts } from "@/actions/receipt";
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/layout/page-layout";
import ReceiptList from "./_components/receipt-list";

export default async function ReceiptsPage() {
  const receipts: Receipt[] = await fetchReceipts();
  return (
    <PageLayout>
      <PageHeader backHref="/home">
        <PageTitle>Receipts</PageTitle>
      </PageHeader>
      <PageContent>
        <ReceiptList receipts={receipts} />
      </PageContent>
    </PageLayout>
  );
}
