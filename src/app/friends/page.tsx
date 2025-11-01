import {
  PageContent,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/layout/page-layout";
import FriendsList from "./_components/friends-list";

export default function Friends() {
  return (
    <PageLayout>
      <PageHeader backHref="/home">
        <PageTitle>Friends</PageTitle>
      </PageHeader>
      <PageContent>
        <FriendsList />
      </PageContent>
    </PageLayout>
  );
}