import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { register as registerApi } from "@/api/auth";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";

const registerSchema = z
	.object({
		first_name: z.string().min(1, "First name is required"),
		last_name: z.string().min(1, "Last name is required"),
		username: z.string().min(1, "Username is required"),
		place_of_assignment: z.string().min(1, "Place of assignment is required"),
		phone_number: z.string().min(1, "Phone number is required"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirm_password: z.string().min(1, "Please confirm your password"),
		privacy_policy_agreed: z.boolean().refine((val) => val === true, {
			message: "You must agree to the Privacy Policy to continue",
		}),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({ className }: React.ComponentProps<"form">) {
	const [loading, setLoading] = useState(false);
	const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
	const [alertInfo, setAlertInfo] = useState<{
		title: string;
		description: string;
		icon: React.ComponentType<{ className?: string }>;
		isSuccess?: boolean;
	} | null>(null);
	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			username: "",
			place_of_assignment: "",
			phone_number: "",
			email: "",
			password: "",
			confirm_password: "",
			privacy_policy_agreed: false,
		},
	});
	const { handleSubmit, control } = form;

	async function onSubmit(data: RegisterFormValues) {
		setLoading(true);
		const payload = {
			first_name: data.first_name,
			last_name: data.last_name,
			username: data.username,
			place_of_assignment: data.place_of_assignment,
			phone_number: `+63${data.phone_number}`,
			email: data.email,
			password: data.password,
		};
		try {
			await registerApi(payload);
			// Clear the form after successful registration
			form.reset();
			setAlertInfo({
				title: "Registration Successful!",
				description:
					"Your account has been created successfully! Please wait for admin approval before you can log in.",
				icon: CheckCircle,
				isSuccess: true,
			});
		} catch (err: unknown) {
			let message = "Registration failed";
			if (
				typeof err === "object" &&
				err !== null &&
				"response" in err &&
				(err as { response?: unknown }).response instanceof Response
			) {
				const response = (err as { response: Response }).response;
				if (response && typeof response.json === "function") {
					try {
						const errorData = await response.json();
						if (errorData?.error) {
							message = errorData.error;
						}
					} catch {
						// ignore JSON parsing errors, use default message
					}
				}
			} else if (err instanceof Error) {
				message = err.message;
			}
			setAlertInfo({
				title: "Registration Failed",
				description: message,
				icon: AlertTriangle,
				isSuccess: false,
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className={cn("flex flex-col gap-6", className)}>
				<Card className="rounded-3xl border shadow-lg w-full max-w-md mx-auto bg-gradient-to-br from-indigo-100 via-purple-50 to-white text-gray-900">
					<CardHeader className="text-center pb-2">
						<CardTitle className="text-2xl font-bold">Join the Fun!</CardTitle>
						<CardDescription>
							Let&apos;s create your play account!
						</CardDescription>
					</CardHeader>
					<CardContent className="px-6 pb-6 pt-0">
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="grid gap-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											name="first_name"
											control={control}
											render={({ field }) => (
												<FormItem>
													<FormLabel>First Name</FormLabel>
													<FormControl>
														<Input
															{...field}
															id="first_name"
															className="rounded-lg"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											name="last_name"
											control={control}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Last Name</FormLabel>
													<FormControl>
														<Input
															{...field}
															id="last_name"
															className="rounded-lg"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											name="username"
											control={control}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Username</FormLabel>
													<FormControl>
														<Input
															{...field}
															id="username"
															className="rounded-lg"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											name="place_of_assignment"
											control={control}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Place of Assignment</FormLabel>
													<FormControl>
														<Select
															value={field.value}
															onValueChange={field.onChange}
														>
															<SelectTrigger className="w-full rounded-lg">
																<SelectValue placeholder="Select a Place" />
															</SelectTrigger>
															<SelectContent className="w-full min-w-[200px]">
																<SelectGroup>
																	<SelectLabel>Places</SelectLabel>
																	<SelectItem value="Bontoc">Bontoc</SelectItem>
																	<SelectItem value="Barlig">Barlig</SelectItem>
																	<SelectItem value="Bauko">Bauko</SelectItem>
																	<SelectItem value="Besao">Besao</SelectItem>
																	<SelectItem value="Natonin">
																		Natonin
																	</SelectItem>
																	<SelectItem value="Paracelis">
																		Paracelis
																	</SelectItem>
																	<SelectItem value="Sabangan">
																		Sabangan
																	</SelectItem>
																	<SelectItem value="Sadanga">
																		Sadanga
																	</SelectItem>
																	<SelectItem value="Sagada">Sagada</SelectItem>
																	<SelectItem value="Tadian">Tadian</SelectItem>
																</SelectGroup>
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											name="phone_number"
											control={control}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Number</FormLabel>
													<FormControl>
														<div className="flex items-center">
															<span className="px-2 py-2 border border-r-0 rounded-l-lg bg-indigo-100 text-indigo-700 select-none">
																+63
															</span>
															<Input
																{...field}
																id="phone_number"
																type="text"
																inputMode="numeric"
																maxLength={10}
																className="rounded-r-lg rounded-l-none"
																placeholder="9123456789"
																onChange={(e) => {
																	// Only allow numbers, max 10 digits
																	const value = e.target.value
																		.replace(/\D/g, "")
																		.slice(0, 10);
																	field.onChange(value);
																}}
																value={field.value}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
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
															className="rounded-lg"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										name="password"
										control={control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
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
									<FormField
										name="confirm_password"
										control={control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<Input
														{...field}
														id="confirm_password"
														type="password"
														className="rounded-lg"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Privacy Policy Section */}
									<div className="space-y-3">
										<FormField
											name="privacy_policy_agreed"
											control={control}
											render={({ field }) => (
												<FormItem className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<div className="space-y-1 leading-none">
														<FormLabel className="text-sm font-normal">
															I agree to the{" "}
															<Dialog
																open={privacyPolicyOpen}
																onOpenChange={setPrivacyPolicyOpen}
															>
																<DialogTrigger asChild>
																	<button
																		type="button"
																		className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
																	>
																		Privacy Policy
																	</button>
																</DialogTrigger>
																<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
																	<div className="space-y-4 text-sm text-gray-700">
																		<div>
																			<h4 className="text-lg font-semibold text-gray-900 mb-2">
																				Privacy Policy
																			</h4>
																			<p className="mb-3 leading-relaxed">
																				PrepPlay is committed to maintaining the
																				highest standards of confidentiality and
																				data security. All information shared
																				within the app is securely encrypted and
																				accessible only to authorized personnel.
																				Children's identities and personal
																				details are safeguarded at every step,
																				and no data is shared with third parties
																				without explicit, informed consent and
																				legal compliance.
																			</p>
																		</div>
																		<div>
																			<h4 className="text-lg font-semibold text-gray-900 mb-2">
																				Policy Statement
																			</h4>
																			<p className="leading-relaxed">
																				PrepPlay adheres to a strict code of
																				ethical practice rooted in
																				child-centered and trauma-informed care.
																				The application is designed to respect
																				each child's autonomy, dignity, and
																				privacy, providing interviewers with
																				secure tools and protocols while
																				prioritizing the well-being and safety
																				of every user throughout their
																				engagement with the platform.
																			</p>
																		</div>
																	</div>
																</DialogContent>
															</Dialog>
															<Info className="w-4 h-4" />
														</FormLabel>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>
									</div>

									<Button
										type="submit"
										className="w-full mt-2 bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl"
										disabled={loading}
									>
										{loading ? "Signing You Up..." : "Join the Adventure!"}
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
				<div className="text-center text-sm">
					Already have an account?{" "}
					<Link
						to="/login"
						className="underline underline-offset-4 text-indigo-600"
					>
						Login
					</Link>
				</div>
			</div>

			<AlertDialog open={!!alertInfo} onOpenChange={() => setAlertInfo(null)}>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader className="text-center">
						<div
							className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
								alertInfo?.isSuccess ? "bg-green-100" : "bg-red-100"
							}`}
						>
							{alertInfo && (
								<alertInfo.icon
									className={`h-6 w-6 ${
										alertInfo.isSuccess ? "text-green-600" : "text-red-600"
									}`}
								/>
							)}
						</div>
						<AlertDialogTitle className="text-xl font-bold text-gray-900">
							{alertInfo?.title}
						</AlertDialogTitle>
						<AlertDialogDescription className="text-gray-600 mt-2">
							{alertInfo?.description}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className="flex flex-col gap-2 mt-6">
						<AlertDialogAction
							className={`w-full ${
								alertInfo?.isSuccess
									? "bg-green-600 hover:bg-green-700"
									: "bg-red-600 hover:bg-red-700"
							} text-white`}
						>
							{alertInfo?.isSuccess ? "Great!" : "Got It"}
						</AlertDialogAction>
						<Button
							variant="ghost"
							onClick={() => setAlertInfo(null)}
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
