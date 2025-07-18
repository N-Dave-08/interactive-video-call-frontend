import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({ className }: React.ComponentProps<"form">) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
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
			phone_number: data.phone_number,
			email: data.email,
			password: data.password,
		};
		try {
			await registerApi(payload);
			toast.success("Registration successful! Please wait for admin approval.");
			setTimeout(() => navigate("/login"), 1500);
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
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}

	return (
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
																<SelectItem value="Natonin">Natonin</SelectItem>
																<SelectItem value="Paracelis">
																	Paracelis
																</SelectItem>
																<SelectItem value="Sabangan">
																	Sabangan
																</SelectItem>
																<SelectItem value="Sadanga">Sadanga</SelectItem>
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
			<div className="text-indigo-700 *:[a]:hover:text-purple-600 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By registering, you agree to our <a href="/">Terms of Service</a> and{" "}
				<a href="/">Privacy Policy</a>.
			</div>
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
	);
}
