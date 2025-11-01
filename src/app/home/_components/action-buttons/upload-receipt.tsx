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
import { cn } from "@/lib/utils";
import FriendAvatar from "@/components/friend-avatar";
import { Friend } from "@/types";
import { toast } from "sonner";
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
    .refine(
      (file) => typeof window !== "undefined" && file instanceof window.File,
      { message: "A file is required" }
    ),
});

type UploadReceiptFormValues = z.infer<typeof uploadReceiptSchema>;

export default function UploadReceipt({ friends }: { friends: Friend[] }) {
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
    try {
      if (data.file) {
        const formData = new FormData();
        formData.append("file", data.file);
        data.friends.forEach((id) => {
          formData.append("friend_ids", id.toString());
        });

        const response = await fetch("/api/receipts/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to upload receipt");
        }

        toast.success("Receipt uploaded successfully");
        window.location.reload(); // Refresh to show new receipt
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload receipt"
      );
    } finally {
      setOpen(false);
      form.reset();
    }
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
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
