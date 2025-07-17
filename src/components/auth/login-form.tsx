import { zodResolver } from "@hookform/resolvers/zod";
// import { Apple, Chrome as Google } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { login as loginApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ className }: React.ComponentProps<"form">) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const { handleSubmit, control } = form;

	function isErrorWithResponse(
		error: unknown,
	): error is { response: Response } {
		return (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as { response?: unknown }).response === "object" &&
			(error as { response: unknown }).response instanceof Response
		);
	}

	async function onSubmit(values: LoginFormValues) {
		setLoading(true);
		try {
			const data = await loginApi(values.email, values.password);
			login(data.user, data.token);
			navigate("/dashboard");
		} catch (err: unknown) {
			let message = "Login failed";
			if (isErrorWithResponse(err)) {
				const response = err.response;
				if (response && typeof response.json === "function") {
					try {
						const errorData = await response.json();
						if (errorData?.error) {
							message = errorData.error;
						}
					} catch {
						// Ignore JSON parsing errors, use default message
					}
				}
			} else if (err instanceof Error) {
				message = err.message;
			}
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)}>
			<Card className="rounded-3xl shadow-lg bg-gradient-to-br from-indigo-100 via-purple-50 to-white text-gray-900">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Ready to Play?</CardTitle>
					<CardDescription>
						Let&apos;s get you logged in, little explorer!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid gap-6">
								{/* <div className="flex flex-col gap-4">
									<Button
										variant="outline"
										className="w-full rounded-xl border-indigo-400 text-indigo-700 hover:bg-indigo-100 bg-white"
										type="button"
									>
										<Apple className="h-5 w-5 mr-2" />
										Login with Apple
									</Button>
									<Button
										variant="outline"
										className="w-full rounded-xl border-purple-400 text-purple-700 hover:bg-purple-100 bg-white"
										type="button"
									>
										<Google className="h-5 w-5 mr-2" />
										Login with Google
									</Button>
								</div> */}
								{/* <div className="after:border-indigo-200 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
									<span className="bg-white text-indigo-700 relative z-10 px-2">
										Or continue with
									</span>
								</div> */}
								<div className="grid gap-6">
									<FormField
										name="email"
										control={control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														{...field}
														id="email"
														type="email"
														placeholder="m@example.com"
														className="rounded-lg"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="password"
										control={control}
										render={({ field }) => (
											<FormItem>
												<div className="flex items-center">
													<FormLabel>Password</FormLabel>
													<a
														href="/forgot-password"
														className="ml-auto text-sm underline-offset-4 hover:underline text-indigo-600"
													>
														Forgot your password?
													</a>
												</div>
												<FormControl>
													<Input
														{...field}
														id="password"
														type="password"
														className="rounded-lg"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="submit"
										className="w-full bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl"
										disabled={loading}
									>
										{loading ? "Loading Fun..." : "Let's Go!"}
									</Button>
								</div>
								<div className="text-center text-sm">
									Don&apos;t have an account?{" "}
									<Link
										to="/register"
										className="underline underline-offset-4 text-indigo-600"
									>
										Sign up
									</Link>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			<div className="text-indigo-700 *:[a]:hover:text-purple-600 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our <a href="/">Terms of Service</a>{" "}
				and <a href="/">Privacy Policy</a>.
			</div>
		</div>
	);
}
