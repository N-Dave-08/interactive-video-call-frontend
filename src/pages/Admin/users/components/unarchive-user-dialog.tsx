import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, UserCheck } from "lucide-react";
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

interface UnarchiveUserDialogProps {
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
	onUnarchive?: (user: User) => void;
}

export function UnarchiveUserDialog({
	user,
	open,
	onOpenChange,
	onUnarchive,
}: UnarchiveUserDialogProps) {
	const queryClient = useQueryClient();
	const { token } = useAuth();

	const { mutate: unarchiveUserMutation, isPending } = useMutation({
		mutationFn: async () => {
			if (!token) throw new Error("No token");
			await updateUserCondition(user.id, "approved", token);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User unarchived successfully");
			onUnarchive?.(user as User);
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Failed to unarchive user");
		},
	});

	const handleUnarchive = async () => {
		unarchiveUserMutation();
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
					<DialogTitle className="flex items-center gap-2 text-green-600">
						<UserCheck className="h-5 w-5" />
						Unarchive User
					</DialogTitle>
					<DialogDescription>
						This will restore the user account. The user will be able to access
						the system again with their previous permissions.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Success Message */}
					<div className="rounded-lg border border-green-200 bg-green-50 p-4">
						<div className="flex items-start gap-3">
							<UserCheck className="h-5 w-5 text-green-600 mt-0.5" />
							<div className="flex-1">
								<h4 className="font-medium text-green-800">
									Are you sure you want to unarchive this user?
								</h4>
								<p className="text-sm text-green-700 mt-1">
									This action will restore the user account. The user will be
									able to access the system again with their previous
									permissions and data.
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

					{/* Additional Info */}
					<div className="text-sm text-muted-foreground">
						<p>
							<strong>User ID:</strong> {user.id}
						</p>
						<p className="mt-1">
							This user will be restored and will be able to log in and perform
							actions according to their role permissions. All their previous
							data and settings will be preserved.
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
								<UserCheck className="h-4 w-4" />
								Unarchiving...
							</>
						) : (
							<>
								<RotateCcw className="h-4 w-4" />
								Unarchive User
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
