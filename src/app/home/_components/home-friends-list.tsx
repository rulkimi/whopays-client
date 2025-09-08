import FriendAvatar from "@/components/friend-avatar";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/layout/section-layout";
import { AvatarGroup } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HomeFriendsList({
  friends
} : {
  friends: Friend[];
}) {
  return (
    <Section>
      <SectionHeader className="flex justify-between gap-1">
        <SectionTitle>Friends</SectionTitle>
        <Link
					href="/friends"
					className={cn(
						"flex items-center gap-1 rounded-md",
						"text-primary font-medium text-sm",
						"active:bg-muted/60 active:opacity-80 transition",
						"select-none tap-transparent",
						"tracking-[0] uppercase",
						"ios-link-shadow",
					)}
					style={{
						WebkitTapHighlightColor: "transparent",
					}}
				>
					<span className="pr-0.5">All friends</span>
					<ChevronRight className="w-4 h-4 text-primary" />
				</Link>
      </SectionHeader>
      <SectionContent>
        <Card>
          <CardContent>
            <AvatarGroup>
              {friends.map((friend, idx) => (
                <FriendAvatar key={friend.id} friend={friend} />
              ))}
            </AvatarGroup>
          </CardContent>
        </Card>
      </SectionContent>
    </Section>
  )
}