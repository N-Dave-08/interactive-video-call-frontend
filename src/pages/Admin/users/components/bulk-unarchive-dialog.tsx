import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Users, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { updateUserCondition } from "@/api/users";
import { useAuth } from "@/hooks/useAuth";
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
import type { User } from "@/types";

interface BulkUnarchiveDialogProps {
	users: User[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function BulkUnarchiveDialog({
	users,
	open,
	onOpenChange,
}: BulkUnarchiveDialogProps) {
	const queryClient = useQueryClient();
	const { token } = useAuth();

	const { mutate: unarchiveUsersMutation, isPending } = useMutation({
		mutationFn: async () => {
			if (!token) throw new Error("No token");
			// Unarchive all users sequentially by setting status to approved
			for (const user of users) {
				await updateUserCondition(user.id, "approved", token);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success(`Successfully unarchived ${users.length} user(s)`);
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Failed to unarchive some users");
		},
	});

	const handleUnarchive = async () => {
		unarchiveUsersMutation();
	};

	const getRoleBadge = (role: string) => {
		if (role === "admin") {
			return (
				<Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-none px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm">
					Admin
				</Badge>
			);
		}
		if (role === "social_worker") {
			return (
				<Badge className="bg-gradient-to-r from-sky-500 to-teal-500 text-white border-none px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm">
					Social Worker
				</Badge>
			);
		}
		return (
			<Badge className="bg-gray-200 text-gray-800 border-gray-300 px-2 py-0.5 text-xs font-semibold rounded-full">
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
			archived: {
				variant: "outline" as const,
				color: "text-gray-500",
			},
		};

		const config =
			variants[condition as keyof typeof variants] || variants.pending;

		return (
			<Badge
				variant={config.variant}
				className="flex items-center gap-1 capitalize text-xs"
			>
				{condition}
			</Badge>
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-green-600">
						<UserCheck className="h-5 w-5" />
						Bulk Unarchive Users
					</DialogTitle>
					<DialogDescription>
						This will restore {users.length} selected user(s). They will be able
						to access the system again with their previous permissions.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Success Message */}
					<div className="rounded-lg border border-green-200 bg-green-50 p-4">
						<div className="flex items-start gap-3">
							<UserCheck className="h-5 w-5 text-green-600 mt-0.5" />
							<div className="flex-1">
								<h4 className="font-medium text-green-800">
									Are you sure you want to unarchive {users.length} user(s)?
								</h4>
								<p className="text-sm text-green-700 mt-1">
									This action will restore all selected user accounts. The users
									will be able to access the system again with their previous
									permissions and data.
								</p>
							</div>
						</div>
					</div>

					{/* Users List */}
					<div className="space-y-3">
						<h4 className="font-medium text-sm">Selected Users:</h4>
						<div className="max-h-60 overflow-y-auto space-y-2">
							{users.map((user) => (
								<div
									key={user.id}
									className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
								>
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={user.profile_picture ?? "/placeholder.svg"}
											alt={`${user.first_name} ${user.last_name}`}
										/>
										<AvatarFallback className="text-xs">
											{user.first_name[0]}
											{user.last_name[0]}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-medium text-sm truncate">
												{user.first_name} {user.last_name}
											</span>
											{getRoleBadge(user.role)}
											{getConditionBadge(user.condition)}
										</div>
										<div className="text-xs text-muted-foreground truncate">
											{user.email}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Summary */}
					<div className="text-sm text-muted-foreground">
						<p>
							<strong>Total Users:</strong> {users.length}
						</p>
						<p className="mt-1">
							All selected users will be restored and will be able to log in and
							perform actions according to their role permissions. All their
							previous data and settings will be preserved.
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
						variant="default"
						onClick={handleUnarchive}
						disabled={isPending}
						className="gap-2 bg-green-600 hover:bg-green-700"
					>
						{isPending ? (
							<>
								<RotateCcw className="h-4 w-4" />
								Unarchiving...
							</>
						) : (
							<>
								<Users className="h-4 w-4" />
								Unarchive {users.length} User(s)
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
