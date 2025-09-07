import { fetchDashboard } from "@/actions/dashboard";
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/layout/page-layout";
import ReceiptList from "../receipts/_components/receipt-list";

export default async function HomePage() {
  const dashboard: DashboardData = await fetchDashboard();
  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>Home</PageTitle>
      </PageHeader>
      <PageContent>
        <ReceiptList
          receipts={dashboard.receipts} 
          href="/receipts"
        />
      </PageContent>
    </PageLayout>
  );
}
