import { fetchDashboard } from "@/actions/dashboard";
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/layout/page-layout";
import ReceiptList from "../receipts/_components/receipt-list";
import HomeFriendsList from "./_components/home-friends-list";

export default async function HomePage() {
  const dashboard: DashboardData = await fetchDashboard();
  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>Home</PageTitle>
      </PageHeader>
      <PageContent className="space-y-4">
        <HomeFriendsList friends={dashboard.friends} />
        <ReceiptList
          receipts={dashboard.receipts} 
          href="/receipts"
        />
      </PageContent>
    </PageLayout>
  );
}
