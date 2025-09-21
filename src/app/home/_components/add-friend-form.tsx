"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertToBase64 } from "@/lib/utils";
import { createFriend } from "@/actions/friend";
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
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import AvatarSelector from "@/components/avatar-selector";
import { getAvatarById } from "@/lib/avatars";
import { refreshDashboardData } from "@/actions/dashboard";

const addFriendSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		file: z.any().optional(),
		avatarId: z.string().optional(),
	})
	.refine((data) => data.file || data.avatarId, {
		message: "Either upload a photo or select an avatar",
		path: ["file"],
	});

type AddFriendFormValues = z.infer<typeof addFriendSchema>;

export default function AddFriendForm({
	onSuccess,
}: {
	onSuccess?: () => void;
}) {
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

	const form = useForm<AddFriendFormValues>({
		resolver: zodResolver(addFriendSchema),
		defaultValues: {
			name: "",
			file: undefined,
			avatarId: undefined,
		},
	});

	const file = form.watch("file");

	const onSubmit = async (data: AddFriendFormValues) => {
		setSubmitting(true);
		setErrorMsg(null);
		try {
			let base64Result: string;

			if (data.file) {
				// Convert uploaded file to base64
				base64Result = await new Promise<string>((resolve) => {
					convertToBase64(data.file, (result) => {
						const base64String =
							typeof result === "string" ? result : result.base64;
						resolve(base64String);
					});
				});
			} else if (data.avatarId) {
				// Convert selected avatar to base64
				const avatar = getAvatarById(data.avatarId);
				if (!avatar) throw new Error("Selected avatar not found");

				// Convert StaticImageData to base64
				base64Result = await new Promise<string>((resolve) => {
					const img = new window.Image();
					img.crossOrigin = "anonymous";
					img.onload = () => {
						const canvas = document.createElement("canvas");
						const ctx = canvas.getContext("2d");
						canvas.width = img.width;
						canvas.height = img.height;
						ctx?.drawImage(img, 0, 0);
						const dataURL = canvas.toDataURL("image/png");
						resolve(dataURL);
					};
					img.src = avatar.src.src;
				});
			} else {
				throw new Error("No image selected");
			}

			const { error } = await createFriend(data.name, base64Result);

			if (error) {
				setErrorMsg(error);
				return;
			}

			form.reset();
			setSuccess(true);
      await refreshDashboardData();

			// Wait a moment, then close dialog
			setTimeout(() => {
				setSuccess(false);
				// Try to close the dialog using the DialogClose ref
				if (dialogCloseRef.current) {
					dialogCloseRef.current.click();
				}
				if (onSuccess) onSuccess();
			}, 1200);
		} catch (error) {
			console.error("Error:", error);
			setErrorMsg(
				(error && typeof error === "object" && "message" in error)
					? (error as { message: string }).message
					: (typeof error === "string" ? error : "An unexpected error occurred")
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{success && (
					<div className="w-full flex justify-center">
						<div className="rounded-md bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-2">
							Friend added successfully!
						</div>
					</div>
				)}
				{errorMsg && (
					<div className="w-full flex justify-center">
						<div className="rounded-md bg-red-100 text-red-800 px-4 py-2 text-sm font-medium mb-2">
							{errorMsg}
						</div>
					</div>
				)}
        {!success && (
          <>
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
                      disabled={submitting || success}
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
                  <FormLabel htmlFor="friend-photo">Upload Photo</FormLabel>
                  <FormControl>
                    <Input
                      id="friend-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                        // Clear avatar selection when file is selected
                        if (file) {
                          form.setValue("avatarId", undefined);
                        }
                      }}
                      disabled={submitting || success}
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

            <div className="text-center text-sm text-muted-foreground">or</div>

            <FormField
              control={form.control}
              name="avatarId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AvatarSelector
                      selectedAvatarId={field.value}
                      onSelect={(avatarId) => {
                        field.onChange(avatarId);
                        // Clear file selection when avatar is selected
                        form.setValue("file", undefined);
                      }}
                      className={submitting || success ? "pointer-events-none opacity-60" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  disabled={submitting || success}
                  ref={dialogCloseRef}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={submitting || form.formState.isSubmitting || success}
                aria-busy={submitting}
              >
                {(submitting || form.formState.isSubmitting) && !success
                  ? "Adding..."
                  : "Add Friend"}
              </Button>
            </DialogFooter>
          </>
        )}
			</form>
		</Form>
	);
}
