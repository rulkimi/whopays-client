import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Friend } from "@/types"

export default function FriendAvatar({ friend }: { friend: Friend }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Avatar className="border-2">
						<AvatarImage src={`/api/file/${friend.photo_url}`} alt={friend.name} />
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