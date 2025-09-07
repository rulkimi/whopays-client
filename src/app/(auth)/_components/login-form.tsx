"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { logIn } from "@/actions/auth";

const loginFormSchema = z.object({
	email: z.email({ message: "Enter a valid email address." }),
	password: z.string().min(8, { message: "Password must be at least 8 characters." })
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
	const router = useRouter();
	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	const onSubmit = async (values: LoginFormSchema) => {
		const response = await logIn(values);
		console.log(response);
		if (response && response.access_token) {
			document.cookie = `access_token=${response.access_token}; path=/;`;
			router.push("/home");
		}
	};

	const onError = (errors: any) => {
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="johndoe@example.com"
										type="email"
										{...field}
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
				>
					Log in
					<ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
				</Button>

				<CardFooter className="flex justify-center text-sm">
					<span className="text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-primary hover:underline font-medium"
						>
							Sign up
						</Link>
					</span>
				</CardFooter>
			</form>
		</Form>
	);
}
