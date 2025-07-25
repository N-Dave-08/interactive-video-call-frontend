import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { updateUserInfo } from "@/api/users";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const editUserSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	phone_number: z.string().optional(),
	place_of_assignment: z.string().min(1, "Place of assignment is required"),
	role: z.enum(["admin", "social_worker"]),
	condition: z.enum(["approved", "pending", "rejected", "blocked"]),
});

type EditUserData = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
	user: {
		id: string;
		first_name: string;
		last_name: string;
		username: string;
		email: string;
		phone_number: string | null;
		place_of_assignment: string;
		role: string;
		condition: string;
		avatar?: string;
	};
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
	user,
	open,
	onOpenChange,
}: EditUserDialogProps) {
	const [formData, setFormData] = useState<EditUserData>({
		first_name: user.first_name,
		last_name: user.last_name,
		username: user.username,
		email: user.email,
		phone_number: user.phone_number || "",
		place_of_assignment: user.place_of_assignment,
		role: user.role as "admin" | "social_worker",
		condition: user.condition as
			| "approved"
			| "pending"
			| "rejected"
			| "blocked",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const queryClient = useQueryClient();
	const { token } = useAuth();

	const { mutate: editUser, isPending } = useMutation({
		mutationFn: async (data: EditUserData) => {
			if (!token) throw new Error("No token");
			await updateUserInfo(user.id, data, token);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User updated successfully");
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Failed to update user");
		},
	});

	const handleInputChange = (field: keyof EditUserData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = (): boolean => {
		try {
			editUserSchema.parse(formData);
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
		editUser(formData);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>
						Update the user information below. Click save when you're done.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* User Avatar and Basic Info */}
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<AvatarImage
								src={user.avatar || "/placeholder.svg"}
								alt={`${user.first_name} ${user.last_name}`}
							/>
							<AvatarFallback className="text-lg">
								{user.first_name[0]}
								{user.last_name[0]}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<h3 className="text-lg font-semibold">
								{user.first_name} {user.last_name}
							</h3>
							<p className="text-sm text-muted-foreground">
								User ID: {user.id}
							</p>
						</div>
					</div>

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

					{/* Status on its own row */}
					<div className="space-y-2 mt-2">
						<Label htmlFor="condition">Status *</Label>
						<Select
							value={formData.condition}
							onValueChange={(value) =>
								handleInputChange(
									"condition",
									value as "approved" | "pending" | "rejected" | "blocked",
								)
							}
						>
							<SelectTrigger
								id="condition"
								className={errors.condition ? "border-red-500" : ""}
							>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="approved">Approved</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
								<SelectItem value="blocked">Blocked</SelectItem>
							</SelectContent>
						</Select>
						{errors.condition && (
							<p className="text-sm text-red-500">{errors.condition}</p>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isPending}>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
