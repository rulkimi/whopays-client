import { fetchReceipts } from "@/actions/receipt";
import { PageContent, PageHeader, PageLayout, PageTitle } from "@/components/layout/page-layout";
import ReceiptCard from "./_components/receipt-card";

export default async function ReceiptsPage() {
	const receipts: Receipt[] = await fetchReceipts();
	return (
    <PageLayout>
      <PageHeader>
        <PageTitle>Receipts</PageTitle>
      </PageHeader>
      <PageContent>
        {receipts.map((receipt, idx) => (
        	<ReceiptCard
        		key={receipt.id}
            index={idx}
            length={receipts.length}
            receipt={receipt}
        	/>
        ))}
      </PageContent>
    </PageLayout>
	);
}
