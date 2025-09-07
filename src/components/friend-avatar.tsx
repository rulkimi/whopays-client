import { getFileUrl } from "@/actions/file"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default async function FriendAvatar({ friend }: { friend: Friend }) {
	const imageUrl = await getFileUrl(friend.photo_url);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Avatar className="border-2">
						<AvatarImage src={imageUrl} alt={friend.name} />
						<AvatarFallback>
							{friend.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.slice(0, 2)
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</TooltipTrigger>
				<TooltipContent>
					<span>{friend.name}</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
} 