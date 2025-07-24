import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";
import { deleteUser } from "@/api/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteUserDialogProps {
	user: {
		id: string;
		first_name: string;
		last_name: string;
		username: string;
		email: string;
		role: string;
		condition: string;
		avatar?: string;
	};
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
	user,
	open,
	onOpenChange,
}: DeleteUserDialogProps) {
	const queryClient = useQueryClient();

	const { mutate: removeUser, isPending } = useMutation({
		mutationFn: async () => {
			await deleteUser(user.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User deleted successfully");
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Failed to delete user");
		},
	});

	const handleDelete = async () => {
		removeUser();
	};

	const getRoleBadge = (role: string) => {
		if (role === "admin") {
			return (
				<Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-none px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
					Admin
				</Badge>
			);
		}
		if (role === "social_worker") {
			return (
				<Badge className="bg-gradient-to-r from-sky-500 to-teal-500 text-white border-none px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
					Social Worker
				</Badge>
			);
		}
		return (
			<Badge className="bg-gray-200 text-gray-800 border-gray-300 px-3 py-1 text-xs font-semibold rounded-full">
				{role}
			</Badge>
		);
	};

	const getConditionBadge = (condition: string) => {
		const variants = {
			approved: {
				variant: "default" as const,
				color: "text-green-600",
			},
			pending: {
				variant: "secondary" as const,
				color: "text-yellow-600",
			},
			rejected: {
				variant: "destructive" as const,
				color: "text-red-600",
			},
			blocked: {
				variant: "outline" as const,
				color: "text-gray-600",
			},
		};

		const config =
			variants[condition as keyof typeof variants] || variants.pending;

		return (
			<Badge
				variant={config.variant}
				className="flex items-center gap-1 capitalize"
			>
				{condition}
			</Badge>
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-destructive">
						<AlertTriangle className="h-5 w-5" />
						Delete User
					</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete the user
						account and remove all associated data.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Warning Message */}
					<div className="rounded-lg border border-red-200 bg-red-50 p-4">
						<div className="flex items-start gap-3">
							<AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
							<div className="flex-1">
								<h4 className="font-medium text-red-800">
									Are you sure you want to delete this user?
								</h4>
								<p className="text-sm text-red-700 mt-1">
									This action will permanently remove the user account and all
									associated data from the system. This cannot be undone.
								</p>
							</div>
						</div>
					</div>

					{/* User Information */}
					<div className="rounded-lg border bg-muted/50 p-4">
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
							<div className="flex-1 space-y-2">
								<div>
									<h3 className="text-lg font-semibold">
										{user.first_name} {user.last_name}
									</h3>
									<p className="text-sm text-muted-foreground">
										@{user.username}
									</p>
								</div>
								<div className="flex items-center gap-2">
									{getRoleBadge(user.role)}
									{getConditionBadge(user.condition)}
								</div>
								<div className="text-sm text-muted-foreground">
									{user.email}
								</div>
							</div>
						</div>
					</div>

					{/* Additional Warning */}
					<div className="text-sm text-muted-foreground">
						<p>
							<strong>User ID:</strong> {user.id}
						</p>
						<p className="mt-1">
							This user will be permanently removed from the system. All their
							sessions, data, and account information will be deleted.
						</p>
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
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isPending}
						className="gap-2"
					>
						{isPending ? (
							<>
								<UserX className="h-4 w-4" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="h-4 w-4" />
								Delete User
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
