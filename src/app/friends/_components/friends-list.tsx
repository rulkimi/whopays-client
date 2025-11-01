import { getFriends } from "@/actions/friend";
import FriendAvatar from "@/components/friend-avatar";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/components/layout/section-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import { Friend } from "@/types"; // Added import for Friend type

export default async function FriendsList() {
  const { data: friends, error } = await getFriends();

  if (error) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Friends</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <div className="text-red-500 p-4">Error loading friends: {error}</div>
        </SectionContent>
      </Section>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Friends</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <div className="text-muted-foreground p-4">
            You have no friends yet.
          </div>
        </SectionContent>
      </Section>
    );
  }

  // Ensure that friends is typed as Friend[]
  const typedFriends = friends as Friend[];

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Friends</SectionTitle>
      </SectionHeader>
      <SectionContent>
        <div className="flex flex-col gap-2">
          {typedFriends.map((friend: Friend, idx: number) => {
            const length = typedFriends.length;
            const cardClass = cn(
              "rounded-none border-t-0 border-b-0 gap-0",
              length === 1 ? "rounded-2xl border-t border-b" : "",
              length === 2 && idx === 0 ? "rounded-t-2xl border-t border-b" : "",
              length === 2 && idx === 1 ? "rounded-b-2xl border-b" : "",
              length > 2 && idx === 0 ? "rounded-t-2xl border-t" : "",
              length > 2 && idx === length - 1 ? "rounded-b-2xl border-b" : "",
              length > 2 && idx !== length - 1 ? "border-b" : ""
            );
            return (
              <Card
                key={friend.id}
                className={cn(
                  "hover:bg-muted/10 cursor-pointer transition-colors",
                  cardClass
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base font-medium">
                    <FriendAvatar friend={friend} />
                    <span>{friend.name}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </SectionContent>
    </Section>
  );
}
