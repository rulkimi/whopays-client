import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function FriendAvatar({ friend }: { friend: Friend }) {
	return (
		<Avatar className="size-6">
			<AvatarImage src={friend.photo_url} alt={friend.name} />
			<AvatarFallback>
				{friend.name
					.split(" ")
					.map((n) => n[0])
					.join("")
					.slice(0, 2)
					.toUpperCase()}
			</AvatarFallback>
		</Avatar>
	)
}