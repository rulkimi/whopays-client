"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, convertToBase64 } from "@/lib/utils";
import FriendAvatar from "@/components/friend-avatar";
import { uploadReceipt } from "@/actions/receipt";
import { Friend } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";

const uploadReceiptSchema = z.object({
	friends: z.array(z.number()).min(1, "Select at least one friend"),
	file: z
		.any()
		.refine((file) => typeof window !== "undefined" && file instanceof window.File, { message: "A file is required" }),
});

type UploadReceiptFormValues = z.infer<typeof uploadReceiptSchema>;

export default function UploadReceipt({
	friends,
}: {
	friends: Friend[];
}) {
	const [open, setOpen] = useState(false);

	const form = useForm<UploadReceiptFormValues>({
		resolver: zodResolver(uploadReceiptSchema),
		defaultValues: {
			friends: [],
			file: undefined,
		},
	});

	const selectedFriends = form.watch("friends");
	const file = form.watch("file");

	const handleFriendToggle = (id: number) => {
		const current = selectedFriends || [];
		if (current.includes(id)) {
			form.setValue(
				"friends",
				current.filter((fid: number) => fid !== id),
				{ shouldValidate: true }
			);
		} else {
			form.setValue("friends", [...current, id], { shouldValidate: true });
		}
	};

	const onSubmit = async (data: UploadReceiptFormValues) => {
		console.log("onSubmit called with data:", data);

		if (data.file) {
			console.log("File detected in form data:", data.file);

			// Convert to base64 on the client side (like add-friend-form)
			const base64Result = await new Promise<string>((resolve) => {
				convertToBase64(data.file, (result) => {
					const base64String = typeof result === 'string' ? result : result.base64;
					console.log("Converted file to base64:", base64String.slice(0,100) + '...'); // log only first 100 chars
					resolve(base64String);
				});
			});

			console.log("Calling uploadReceipt with base64Result and friends:", data.friends);
			await uploadReceipt(base64Result, data.friends);
			console.log("uploadReceipt finished");
		} else {
			console.log("No file present in form data.");
		}

		setOpen(false);
		form.reset();
		console.log("Dialog closed and form reset.");
	};

  const onError = (values: unknown) => console.log(values);

	const handleDialogClose = () => {
		setOpen(false);
		form.reset();
	};

	return (
		<>
			<div
				className="border border-dashed border-primary p-4 rounded-md text-primary cursor-pointer transition hover:bg-primary/10 hover:shadow-md flex items-center justify-center gap-2 select-none"
				style={{ WebkitTapHighlightColor: "transparent" }}
				tabIndex={0}
				role="button"
				aria-label="Upload Receipt"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") setOpen(true);
				}}
			>
				<Upload className="w-5 h-5 text-primary" />
				<span>Upload Receipt</span>
			</div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload Receipt</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, onError)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="friends"
								render={() => (
									<FormItem>
										<FormLabel>Add Friends</FormLabel>
										<div className="flex flex-wrap gap-2">
											{friends.map((friend) => (
												<button
													type="button"
													key={friend.id}
													className={cn(
														"pl-1 pr-2 py-1 rounded-full border transition flex items-center gap-1",
														selectedFriends?.includes(friend.id)
															? "bg-primary text-primary-foreground border-primary"
															: "bg-muted text-muted-foreground border-muted"
													)}
													onClick={() => handleFriendToggle(friend.id)}
												>
													<FriendAvatar friend={friend} />
													<span>{friend.name}</span>
												</button>
											))}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="file"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="receipt-upload">Upload Image</FormLabel>
										<FormControl>
											<Input
												id="receipt-upload"
												type="file"
												accept="image/*"
												onChange={(e) => {
													const file = e.target.files?.[0];
													field.onChange(file);
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
										onClick={handleDialogClose}
									>
										Cancel
									</Button>
								</DialogClose>
								<Button
									type="submit"
									disabled={form.formState.isSubmitting}
								>
									Submit
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
}