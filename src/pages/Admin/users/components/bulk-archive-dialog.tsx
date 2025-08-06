import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Archive, Users } from "lucide-react";
import { toast } from "sonner";
import { archiveUser } from "@/api/users";
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

interface BulkArchiveDialogProps {
	users: User[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function BulkArchiveDialog({
	users,
	open,
	onOpenChange,
}: BulkArchiveDialogProps) {
	const queryClient = useQueryClient();
	const { token } = useAuth();

	const { mutate: archiveUsersMutation, isPending } = useMutation({
		mutationFn: async () => {
			if (!token) throw new Error("No token");
			// Archive all users sequentially
			for (const user of users) {
				await archiveUser(user.id, token);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success(`Successfully archived ${users.length} user(s)`);
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Failed to archive some users");
		},
	});

	const handleArchive = async () => {
		archiveUsersMutation();
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
					<DialogTitle className="flex items-center gap-2 text-destructive">
						<Archive className="h-5 w-5" />
						Bulk Archive Users
					</DialogTitle>
					<DialogDescription>
						This will archive {users.length} selected user(s). They will no
						longer be able to access the system, but their data will be
						preserved.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Warning Message */}
					<div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
						<div className="flex items-start gap-3">
							<Archive className="h-5 w-5 text-orange-600 mt-0.5" />
							<div className="flex-1">
								<h4 className="font-medium text-orange-800">
									Are you sure you want to archive {users.length} user(s)?
								</h4>
								<p className="text-sm text-orange-700 mt-1">
									This action will archive all selected user accounts. The users
									will no longer be able to access the system, but their data
									will be preserved for future reference.
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
							All selected users will be archived and will no longer be able to
							access the system. Their data will be preserved but they will not
							be able to log in or perform any actions.
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
						onClick={handleArchive}
						disabled={isPending}
						className="gap-2"
					>
						{isPending ? (
							<>
								<Archive className="h-4 w-4" />
								Archiving...
							</>
						) : (
							<>
								<Users className="h-4 w-4" />
								Archive {users.length} User(s)
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
