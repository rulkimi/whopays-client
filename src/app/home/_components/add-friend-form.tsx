"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { convertToBase64 } from "@/lib/utils"
import { createFriend } from "@/actions/friend"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"

const addFriendSchema = z.object({
	name: z.string().min(1, "Name is required"),
	file: z
		.instanceof(File)
		.refine((file) => !!file, { message: "A photo is required" }),
})

type AddFriendFormValues = z.infer<typeof addFriendSchema>

export default function AddFriendForm({
	onSuccess,
}: {
	onSuccess?: () => void
}) {
	const [submitting, setSubmitting] = useState(false)

	const form = useForm<AddFriendFormValues>({
		resolver: zodResolver(addFriendSchema),
		defaultValues: {
			name: "",
			file: undefined,
		},
	})

	const file = form.watch("file")

	const onSubmit = async (data: AddFriendFormValues) => {
		setSubmitting(true)
		try {
			await new Promise<void>((resolve) => {
				convertToBase64(data.file, async (result) => {
					await createFriend(data.name, result)
					resolve()
				})
			})
			form.reset()
			if (onSuccess) onSuccess()
		} catch {
			// Optionally handle error
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor="friend-name">Name</FormLabel>
							<FormControl>
								<Input
									id="friend-name"
									placeholder="Enter friend's name"
									autoComplete="off"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor="friend-photo">Photo</FormLabel>
							<FormControl>
								<Input
									id="friend-photo"
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0]
										field.onChange(file)
									}}
								/>
							</FormControl>
							{file && (
								<div className="mt-2 text-sm text-muted-foreground">
									Selected: {file.name}
								</div>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant="outline"
							type="button"
							disabled={submitting}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="submit"
						disabled={submitting || form.formState.isSubmitting}
					>
						Add Friend
					</Button>
				</DialogFooter>
			</form>
		</Form>
	)
}