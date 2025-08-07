import { zodResolver } from "@hookform/resolvers/zod";
// import { Apple, Chrome as Google } from "lucide-react";
import {
	AlertTriangle,
	Shield,
	Lock,
	UserX,
	Network,
	Mail,
	Key,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

interface ErrorInfo {
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	sections: Array<{
		icon: React.ComponentType<{ className?: string }>;
		title: string;
		description: string;
	}>;
}

export function LoginForm({ className }: React.ComponentProps<"form">) {
	const [loading, setLoading] = useState(false);
	const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
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

	function getErrorInfo(errorMessage: string): ErrorInfo {
		const message = errorMessage.toLowerCase();

		// Invalid credentials
		if (
			message.includes("invalid") ||
			message.includes("incorrect") ||
			message.includes("wrong")
		) {
			return {
				title: "Invalid Credentials",
				description: "The email or password you entered is incorrect.",
				icon: UserX,
				sections: [
					{
						icon: Mail,
						title: "Check Your Email",
						description:
							"Make sure you're using the correct email address associated with your account.",
					},
					{
						icon: Key,
						title: "Verify Your Password",
						description:
							"Ensure your password is correct and check for any typos or caps lock.",
					},
				],
			};
		}

		// Account not found
		if (
			message.includes("not found") ||
			message.includes("doesn't exist") ||
			message.includes("no account")
		) {
			return {
				title: "Account Not Found",
				description:
					"We couldn't find an account with the email address you provided.",
				icon: UserX,
				sections: [
					{
						icon: Mail,
						title: "Email Address",
						description:
							"Double-check the email address you entered. It might be misspelled or you might be using a different email.",
					},
					{
						icon: Shield,
						title: "Create Account",
						description:
							"If you don't have an account yet, you can sign up for a new account using the link below.",
					},
				],
			};
		}

		// Account locked/disabled
		if (
			message.includes("locked") ||
			message.includes("disabled") ||
			message.includes("suspended") ||
			message.includes("restricted")
		) {
			return {
				title: "Account Restricted",
				description:
					"Your account has been temporarily restricted due to security concerns.",
				icon: Lock,
				sections: [
					{
						icon: Shield,
						title: "Security Review",
						description:
							"Your account is under review for unusual activity or policy violations. This is a precautionary measure.",
					},
					{
						icon: Lock,
						title: "Access Temporarily Disabled",
						description:
							"Login access has been disabled while we complete our review. You'll be notified once the restriction is lifted.",
					},
				],
			};
		}

		// Network/connection errors
		if (
			message.includes("network") ||
			message.includes("connection") ||
			message.includes("timeout") ||
			message.includes("unreachable")
		) {
			return {
				title: "Connection Error",
				description:
					"We're having trouble connecting to our servers right now.",
				icon: Network,
				sections: [
					{
						icon: Network,
						title: "Check Your Connection",
						description:
							"Make sure you have a stable internet connection and try again.",
					},
					{
						icon: Shield,
						title: "Server Status",
						description:
							"Our servers might be experiencing temporary issues. Please try again in a few minutes.",
					},
				],
			};
		}

		// Too many attempts
		if (
			message.includes("too many") ||
			message.includes("rate limit") ||
			message.includes("attempts")
		) {
			return {
				title: "Too Many Attempts",
				description:
					"You've made too many login attempts. Please wait before trying again.",
				icon: Lock,
				sections: [
					{
						icon: Shield,
						title: "Security Protection",
						description:
							"This is a security measure to protect your account from unauthorized access attempts.",
					},
					{
						icon: Lock,
						title: "Wait and Retry",
						description:
							"Please wait a few minutes before attempting to log in again, or try resetting your password.",
					},
				],
			};
		}

		// Default error
		return {
			title: "Login Failed",
			description: errorMessage,
			icon: AlertTriangle,
			sections: [
				{
					icon: Shield,
					title: "Authentication Error",
					description:
						"There was an issue with your login attempt. Please check your credentials and try again.",
				},
				{
					icon: Lock,
					title: "Need Help?",
					description:
						"If you continue to have problems, you can reset your password or contact support for assistance.",
				},
			],
		};
	}

	async function onSubmit(values: LoginFormValues) {
		setLoading(true);
		try {
			await login(values.email, values.password);
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
			setErrorInfo(getErrorInfo(message));
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
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
			</div>

			<AlertDialog open={!!errorInfo} onOpenChange={() => setErrorInfo(null)}>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader className="text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
							{errorInfo && <errorInfo.icon className="h-6 w-6 text-red-600" />}
						</div>
						<AlertDialogTitle className="text-xl font-bold text-gray-900">
							{errorInfo?.title}
						</AlertDialogTitle>
						<AlertDialogDescription className="text-gray-600 mt-2">
							{errorInfo?.description}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className="space-y-4 mt-6">
						{errorInfo?.sections.map((section, index) => {
							const IconComponent = section.icon;
							return (
								<div
									key={`${section.title}-${index}`}
									className="flex items-start space-x-3"
								>
									<div className="flex-shrink-0">
										<IconComponent className="h-5 w-5 text-gray-400" />
									</div>
									<div>
										<h4 className="font-semibold text-gray-900">
											{section.title}
										</h4>
										<p className="text-sm text-gray-600 mt-1">
											{section.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>

					<div className="flex flex-col gap-2 mt-6">
						<AlertDialogAction className="w-full bg-red-600 hover:bg-red-700 text-white">
							Got It
						</AlertDialogAction>
						<Button
							variant="ghost"
							onClick={() => setErrorInfo(null)}
							className="w-full text-gray-600 hover:text-gray-800"
						>
							Close
						</Button>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
