import type React from "react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { register as registerApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function RegisterForm({ className }: React.ComponentProps<"form">) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [placeOfAssignment, setPlaceOfAssignment] = useState("");

	// Refs for all required fields
	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const usernameRef = useRef<HTMLInputElement>(null);
	const phoneNumberRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		if (!placeOfAssignment) {
			toast.error("Please select a place of assignment.");
			setLoading(false);
			return;
		}
		const payload = {
			first_name: firstNameRef.current?.value || "",
			last_name: lastNameRef.current?.value || "",
			username: usernameRef.current?.value || "",
			place_of_assignment: placeOfAssignment,
			phone_number: phoneNumberRef.current?.value || "",
			email: emailRef.current?.value || "",
			password: passwordRef.current?.value || "",
		};
		try {
			await registerApi(payload);
			toast.success("Registration successful! Please log in.");
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
			<Card className="rounded-lg border shadow-sm w-full max-w-md mx-auto">
				<CardHeader className="text-center pb-2">
					<CardTitle className="text-xl">Create your account</CardTitle>
					<CardDescription>
						Fill in the details below to register
					</CardDescription>
				</CardHeader>
				<CardContent className="px-6 pb-6 pt-0">
					<form onSubmit={handleSubmit}>
						<div className="grid gap-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="first_name">First Name</Label>
									<Input id="first_name" required ref={firstNameRef} />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="last_name">Last Name</Label>
									<Input id="last_name" required ref={lastNameRef} />
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="username">Username</Label>
									<Input id="username" required ref={usernameRef} />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="place_of_assignment">
										Place of Assignment
									</Label>
									<Select
										value={placeOfAssignment}
										onValueChange={setPlaceOfAssignment}
									>
										<SelectTrigger className="w-full">
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
												<SelectItem value="Paracelis">Paracelis</SelectItem>
												<SelectItem value="Sabangan">Sabangan</SelectItem>
												<SelectItem value="Sadanga">Sadanga</SelectItem>
												<SelectItem value="Sagada">Sagada</SelectItem>
												<SelectItem value="Tadian">Tadian</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="phone_number">Phone Number</Label>
									<Input id="phone_number" required ref={phoneNumberRef} />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" required ref={emailRef} />
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									required
									ref={passwordRef}
								/>
							</div>
							<Button type="submit" className="w-full mt-2" disabled={loading}>
								{loading ? "Registering..." : "Register"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By registering, you agree to our <a href="/">Terms of Service</a> and{" "}
				<a href="/">Privacy Policy</a>.
			</div>
			<div className="text-center text-sm">
				Already have an account?{" "}
				<Link to="/login" className="underline underline-offset-4">
					Login
				</Link>
			</div>
		</div>
	);
}
