import { fetchDashboard } from "@/actions/dashboard";
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/layout/page-layout";
import ReceiptList from "../receipts/_components/receipt-list";
import HomeFriendsList from "./_components/home-friends-list";
import UploadReceipt from "./_components/action-buttons/upload-receipt";

export default async function HomePage() {
  const result = await fetchDashboard();

  if (!result.success) {
    // TODO: handle page error
    return "Error"
  }

  const dashboard = result.data;
  
  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>Home</PageTitle>
      </PageHeader>
      <PageContent className="space-y-4">
        <div>
          <UploadReceipt friends={dashboard.friends} />
        </div>
        <HomeFriendsList friends={dashboard.friends} />
        <ReceiptList
          receipts={dashboard.receipts} 
          href="/receipts"
        />
      </PageContent>
    </PageLayout>
  );
}
