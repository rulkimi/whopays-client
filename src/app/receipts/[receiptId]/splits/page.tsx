import { fetchReceiptById, fetchReceiptSplits } from "@/actions/receipt";
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/layout/page-layout";
import { cn, formatDateTime } from "@/lib/utils";
import FriendAvatar from "@/components/friend-avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import SplitContent from "@/app/receipts/[receiptId]/splits/_components/split-content";

export default async function ReceiptSplitsPage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  const { receiptId } = await params;
  
  let receipt;
  let splits;
  
  try {
    receipt = await fetchReceiptById(receiptId);
    splits = await fetchReceiptSplits(receiptId);
  } catch (error) {
    console.error("Error fetching receipt or splits data:", error);
    return (
      <PageLayout>
        <PageHeader backHref={`/receipts/${receiptId}`}>
          <PageTitle>Split Bill</PageTitle>
        </PageHeader>
        <PageContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Unable to load receipt splits data.</p>
            <p className="text-sm text-gray-400 mt-2">Please try again later.</p>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader backHref={`/receipts/${receiptId}`}>
        <PageTitle>Split Bill</PageTitle>
      </PageHeader>
      <PageContent>
        <div
          className={cn(
            "mx-auto max-w-3xl w-full bg-white border border-dashed border-gray-300 rounded-[20px] shadow-sm relative overflow-hidden",
            "before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,#fafafa_0px,#fafafa_6px,#f8f8f8_6px,#f8f8f8_12px)] before:opacity-60 before:pointer-events-none"
          )}
          style={{
            fontFamily:
              "'SF Mono', 'Monaco', 'Consolas', 'monospace', 'SF Pro Display', sans-serif",
            padding: "0 0 28px 0",
          }}
        >
          {/* Header */}
          <div className="relative z-20 px-8 pt-10 pb-4 flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2 border-b border-dashed border-gray-300 pb-4">
              <span className="text-xl font-bold tracking-widest uppercase text-gray-900">
                {receipt.restaurant_name}
              </span>
              <span className="text-sm text-gray-500 tracking-wide font-mono">
                {formatDateTime(receipt.created_at)}
              </span>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <Users className="size-4" />
                <span className="font-medium">
                  {receipt.friends.length}{" "}
                  {receipt.friends.length === 1 ? "person" : "persons"}
                </span>
                {receipt.friends.length > 0 && (
                  <AvatarGroup>
                    {receipt.friends.map((friend) => (
                      <FriendAvatar key={friend.id} friend={friend} />
                    ))}
                  </AvatarGroup>
                )}
              </div>

              <SplitContent receipt={receipt} splits={splits} />
            </div>
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}
