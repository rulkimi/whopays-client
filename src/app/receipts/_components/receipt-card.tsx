import FriendAvatar from "@/components/friend-avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatCurrency, formatDateTime } from "@/lib/utils"
import { Receipt } from "@/types";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";
import React from "react"

type ReceiptCardProps = {
	index: number;
	length: number;
  receipt: Receipt;
}

export default function ReceiptCard({
	index,
	length,
  receipt
}: ReceiptCardProps) {
	const cardClass = cn(
		"rounded-none border-t-0 border-b-0 gap-0",
		length === 1 && "rounded-2xl border-t border-b",
		length === 2 && index === 0 && "rounded-t-2xl border-t border-b",
		length === 2 && index === 1 && "rounded-b-2xl border-b",
		length > 2 && index === 0 && "rounded-t-2xl border-t",
		length > 2 && index === length - 1 && "rounded-b-2xl border-b",
    length > 2 && index !== length - 1 && "border-b"
	);

  const persons = receipt.friends.length === 0
    ? "Just you"
    : `${receipt.friends.length} ${receipt.friends.length === 1 ? "person" : "persons"}`;

	return (
		<Link href={`/receipts/${receipt.id}`}>
      <Card className={cn("hover:bg-muted/10 cursor-pointer", cardClass)}>
        <CardHeader>
          <CardTitle className="flex gap-1 justify-between">
            <span>{receipt.restaurant_name}</span>
            <span className="text-primary font-normal">
              {formatCurrency(receipt.total_amount, receipt.currency)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="flex justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="size-4" />
              <span>{formatDateTime(receipt.created_at)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="size-4" />
              <span>{persons}</span>
              <AvatarGroup>
                {receipt.friends.map(friend => (
                  <FriendAvatar key={friend.id} friend={friend} />
                ))}
              </AvatarGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
	)
}