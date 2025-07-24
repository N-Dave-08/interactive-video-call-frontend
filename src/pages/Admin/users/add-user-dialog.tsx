import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createUser } from "@/api/users";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const addUserSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	phone_number: z.string().optional(),
	place_of_assignment: z.string().min(1, "Place of assignment is required"),
	role: z.enum(["admin", "social_worker"]),
	condition: z.literal("pending"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type AddUserData = z.infer<typeof addUserSchema>;

interface AddUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
	const [formData, setFormData] = useState<AddUserData>({
		first_name: "",
		last_name: "",
		username: "",
		email: "",
		phone_number: "",
		place_of_assignment: "",
		role: "social_worker",
		condition: "pending",
		password: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const queryClient = useQueryClient();

	const { mutate: addUser, isPending } = useMutation({
		mutationFn: async (data: AddUserData) => {
			await createUser(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User created successfully");
			setFormData({
				first_name: "",
				last_name: "",
				username: "",
				email: "",
				phone_number: "",
				place_of_assignment: "",
				role: "social_worker",
				condition: "pending",
				password: "",
			});
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Failed to create user");
		},
	});

	const handleInputChange = (field: keyof AddUserData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = (): boolean => {
		try {
			addUserSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Record<string, string> = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as string] = err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSave = async () => {
		if (!validateForm()) {
			toast.error("Please fix the errors in the form");
			return;
		}
		addUser(formData);
	};

	const handleCancel = () => {
		// Reset form when canceling
		setFormData({
			first_name: "",
			last_name: "",
			username: "",
			email: "",
			phone_number: "",
			place_of_assignment: "",
			role: "social_worker",
			condition: "pending",
			password: "",
		});
		setErrors({});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add New User</DialogTitle>
					<DialogDescription>
						Fill in the user information below to create a new user account.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Form Fields */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="first_name">First Name *</Label>
							<Input
								id="first_name"
								value={formData.first_name}
								onChange={(e) =>
									handleInputChange("first_name", e.target.value)
								}
								className={errors.first_name ? "border-red-500" : ""}
								placeholder="John"
							/>
							{errors.first_name && (
								<p className="text-sm text-red-500">{errors.first_name}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="last_name">Last Name *</Label>
							<Input
								id="last_name"
								value={formData.last_name}
								onChange={(e) => handleInputChange("last_name", e.target.value)}
								className={errors.last_name ? "border-red-500" : ""}
								placeholder="Doe"
							/>
							{errors.last_name && (
								<p className="text-sm text-red-500">{errors.last_name}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="username">Username *</Label>
						<Input
							id="username"
							value={formData.username}
							onChange={(e) => handleInputChange("username", e.target.value)}
							className={errors.username ? "border-red-500" : ""}
							placeholder="johndoe"
						/>
						{errors.username && (
							<p className="text-sm text-red-500">{errors.username}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email *</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							className={errors.email ? "border-red-500" : ""}
							placeholder="john.doe@example.com"
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone_number">Phone Number</Label>
						<Input
							id="phone_number"
							value={formData.phone_number}
							onChange={(e) =>
								handleInputChange("phone_number", e.target.value)
							}
							placeholder="+1 (555) 123-4567"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password *</Label>
						<Input
							id="password"
							type="password"
							value={formData.password}
							onChange={(e) => handleInputChange("password", e.target.value)}
							className={errors.password ? "border-red-500" : ""}
							placeholder="Enter password"
						/>
						{errors.password && (
							<p className="text-sm text-red-500">{errors.password}</p>
						)}
					</div>

					{/* Place of Assignment and Role side by side */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="place_of_assignment">Place of Assignment *</Label>
							<Select
								value={formData.place_of_assignment}
								onValueChange={(value) =>
									handleInputChange("place_of_assignment", value)
								}
							>
								<SelectTrigger
									id="place_of_assignment"
									className={errors.place_of_assignment ? "border-red-500" : ""}
								>
									<SelectValue placeholder="Select municipality" />
								</SelectTrigger>
								<SelectContent>
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
								</SelectContent>
							</Select>
							{errors.place_of_assignment && (
								<p className="text-sm text-red-500">
									{errors.place_of_assignment}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="role">Role *</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									handleInputChange("role", value as "admin" | "social_worker")
								}
							>
								<SelectTrigger
									id="role"
									className={errors.role ? "border-red-500" : ""}
								>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="social_worker">Social Worker</SelectItem>
								</SelectContent>
							</Select>
							{errors.role && (
								<p className="text-sm text-red-500">{errors.role}</p>
							)}
						</div>
					</div>

					{/* Status Info */}
					<div className="rounded-lg border bg-muted/50 p-4 mt-4">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-yellow-500"></div>
							<span className="text-sm font-medium text-muted-foreground">
								Initial Status: Pending
							</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							All new users start with "Pending" status and will need approval
							from an admin.
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleCancel} disabled={isPending}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isPending}>
						{isPending ? "Creating..." : "Create User"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
