"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { signUp } from "@/actions/auth";
import { toast } from "sonner";
import { useState } from "react";

const signupFormSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.email({ message: "Enter a valid email address." }),
	password: z.string().min(8, { message: "Password must be at least 8 characters." }),
	confirmPassword: z.string().min(8, { message: "Confirm your password." })
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match.",
	path: ["confirmPassword"]
});

type SignupFormSchema = z.infer<typeof signupFormSchema>;

export default function SignupForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const form = useForm<SignupFormSchema>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: ""
		}
	});

	const onSubmit = async (values: SignupFormSchema) => {
		setLoading(true);
		try {
			const response = await signUp(values);
			// You may want to check for response.success or similar
			toast.success("Successfully registered! Please log in.");
			router.push("/login");
		} catch (error) {
			console.error(error);
			toast.error("Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const onError = (errors: unknown) => {
		console.log(errors);
	};

	return (
		<Form {...form}>
			<form
				className="space-y-6"
				onSubmit={form.handleSubmit(onSubmit, onError)}
			>
				<div className="space-y-5">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder="John Doe"
										type="text"
										{...field}
										disabled={loading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="johndoe@example.com"
										type="email"
										{...field}
										disabled={loading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										placeholder="********"
										type="password"
										{...field}
										disabled={loading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input
										placeholder="********"
										type="password"
										{...field}
										disabled={loading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					className="w-full flex items-center justify-center gap-2 group"
					type="submit"
					disabled={loading}
				>
					{loading ? (
						<>
							<LoaderCircle className="animate-spin" />
							Signing up...
						</>
					) : (
						<>
							Sign up
							<ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
						</>
					)}
				</Button>

				<CardFooter className="flex justify-center text-sm">
					<span className="text-muted-foreground">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-primary hover:underline font-medium"
						>
							Log in
						</Link>
					</span>
				</CardFooter>
			</form>
		</Form>
	);
}
