import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MoreHorizontal,
	Play,
	Calendar,
	X,
	Trash2,
	CheckCircle,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Suspense, lazy } from "react";
import type { Session } from "@/types";

const DeleteSessionDialog = lazy(() => import("./delete-session-dialog"));
const CancelSessionDialog = lazy(() => import("./cancel-session-dialog"));
const RescheduleSessionDialog = lazy(
	() => import("./reschedule-session-dialog"),
);

interface ActionMenuProps {
	session: Session;
	onStart?: () => void;
	onContinue?: () => void;
	onReschedule?: (newStartTime: string) => void;
	onCancel?: () => void;
	onDelete?: () => void;
	onEnd?: () => void;
	isLoading?: boolean;
	canStart?: boolean;
	canContinue?: boolean;
	className?: string;
}

export default function ActionMenu({
	session,
	onStart,
	onContinue,
	onReschedule,
	onCancel,
	onDelete,
	onEnd,
	isLoading = false,
	canStart = false,
	canContinue = false,
	className,
}: ActionMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Dialog states
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [cancelOpen, setCancelOpen] = useState(false);
	const [rescheduleOpen, setRescheduleOpen] = useState(false);
	const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(
		undefined,
	);
	const [rescheduleTime, setRescheduleTime] = useState<string>("");
	const [rescheduleLoading, setRescheduleLoading] = useState(false);
	const [rescheduleError, setRescheduleError] = useState<string | null>(null);
	const [cancelLoading, setCancelLoading] = useState(false);
	const [cancelError, setCancelError] = useState<string | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	// Determine available actions based on session status
	const getAvailableActions = () => {
		const actions: Array<{
			id: string;
			label: string;
			icon: React.ComponentType<{ className?: string }>;
			onClick?: () => void;
			type: "primary" | "secondary" | "destructive";
			disabled: boolean;
			isIconOnly?: boolean;
		}> = [];

		// Check if session is in welcome stage (should show start button regardless of status)
		if (session.stage === "welcome" && canStart) {
			actions.push({
				id: "start",
				label: "Start Session",
				icon: Play,
				onClick: onStart,
				type: "primary",
				disabled: isLoading,
			});
		}

		switch (session.status) {
			case "scheduled":
				if (canStart) {
					actions.push({
						id: "start",
						label: "Start Session",
						icon: Play,
						onClick: onStart,
						type: "primary",
						disabled: isLoading,
					});
				}
				actions.push(
					{
						id: "reschedule",
						label: "Reschedule",
						icon: Calendar,
						onClick: () => {
							setRescheduleOpen(true);
							const start = new Date(session.start_time);
							setRescheduleDate(
								Number.isNaN(start.getTime()) ? undefined : start,
							);
							const pad = (n: number) => n.toString().padStart(2, "0");
							setRescheduleTime(
								Number.isNaN(start.getTime())
									? ""
									: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
							);
							setRescheduleError(null);
						},
						type: "secondary",
						disabled: isLoading,
					},
					{
						id: "cancel",
						label: "Cancel Session",
						icon: X,
						onClick: () => setCancelOpen(true),
						type: "secondary",
						disabled: isLoading,
					},
				);
				break;

			case "in_progress":
				if (canContinue) {
					actions.push({
						id: "continue",
						label: "Continue Session",
						icon: ArrowRight,
						onClick: onContinue,
						type: "primary",
						disabled: isLoading,
					});
				}
				actions.push({
					id: "end",
					label: "End Session",
					icon: CheckCircle,
					onClick: onEnd,
					type: "secondary",
					disabled: isLoading,
				});
				break;

			case "rescheduled":
				if (canStart) {
					actions.push({
						id: "start",
						label: "Start Session",
						icon: Play,
						onClick: onStart,
						type: "primary",
						disabled: isLoading,
					});
				}
				actions.push(
					{
						id: "reschedule",
						label: "Reschedule",
						icon: Calendar,
						onClick: () => {
							setRescheduleOpen(true);
							const start = new Date(session.start_time);
							setRescheduleDate(
								Number.isNaN(start.getTime()) ? undefined : start,
							);
							const pad = (n: number) => n.toString().padStart(2, "0");
							setRescheduleTime(
								Number.isNaN(start.getTime())
									? ""
									: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
							);
							setRescheduleError(null);
						},
						type: "secondary",
						disabled: isLoading,
					},
					{
						id: "cancel",
						label: "Cancel Session",
						icon: X,
						onClick: () => setCancelOpen(true),
						type: "secondary",
						disabled: isLoading,
					},
				);
				break;

			case "completed":
				// Only destructive actions for completed sessions
				break;

			case "cancelled":
				// Only destructive actions for cancelled sessions
				break;
		}

		// Add delete action for all sessions
		actions.push({
			id: "delete",
			label: "Delete Session",
			icon: Trash2,
			onClick: () => setDeleteOpen(true),
			type: "destructive",
			disabled: isLoading,
			isIconOnly: true, // Mark delete as icon-only
		});

		return actions;
	};

	const actions = getAvailableActions();
	const primaryAction = actions.find((action) => action.type === "primary");
	const secondaryActions = actions.filter(
		(action) => action.type === "secondary",
	);
	const destructiveActions = actions.filter(
		(action) => action.type === "destructive",
	);

	// Create the action menu UI
	const renderActionMenu = () => {
		// If there's a primary action, show it prominently
		if (primaryAction) {
			return (
				<div className={cn("flex items-center gap-2", className)}>
					{/* Primary Action Button */}
					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={{ duration: 0.1 }}
					>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								primaryAction.onClick?.();
							}}
							disabled={primaryAction.disabled}
							className={cn(
								"rounded-full px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200",
								primaryAction.id === "start" &&
									"bg-green-500 hover:bg-green-600 text-white",
								primaryAction.id === "continue" &&
									"bg-purple-500 hover:bg-purple-600 text-white",
							)}
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
									{primaryAction.id === "start" ? "Starting..." : "Loading..."}
								</>
							) : (
								<>
									<primaryAction.icon className="h-4 w-4 mr-2" />
									{primaryAction.label}
								</>
							)}
						</Button>
					</motion.div>

					{/* Secondary Actions Menu */}
					{(secondaryActions.length > 0 || destructiveActions.length > 0) && (
						<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="rounded-full p-2 h-10 w-10"
									disabled={isLoading}
									onClick={(e) => e.stopPropagation()}
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<AnimatePresence>
									{secondaryActions.map((action) => (
										<motion.div
											key={action.id}
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.1 }}
										>
											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation();
													action.onClick?.();
												}}
												disabled={action.disabled}
												className="flex items-center gap-3 cursor-pointer"
											>
												<action.icon className="h-4 w-4" />
												<span>{action.label}</span>
											</DropdownMenuItem>
										</motion.div>
									))}
								</AnimatePresence>

								{destructiveActions.length > 0 &&
									secondaryActions.length > 0 && (
										<DropdownMenuSeparator className="my-2" />
									)}

								<AnimatePresence>
									{destructiveActions.map((action) => (
										<motion.div
											key={action.id}
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.1 }}
										>
											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation();
													action.onClick?.();
												}}
												disabled={action.disabled}
												className="flex items-center gap-3 cursor-pointer"
												title={action.isIconOnly ? action.label : undefined}
											>
												<action.icon className="h-4 w-4" />
												<span>{action.label}</span>
											</DropdownMenuItem>
										</motion.div>
									))}
								</AnimatePresence>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			);
		}

		// If only one action available, show it as a direct button
		if (actions.length === 1) {
			const action = actions[0];
			return (
				<div className={cn("flex items-center gap-2", className)}>
					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={{ duration: 0.1 }}
					>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								action.onClick?.();
							}}
							disabled={action.disabled}
							variant={
								action.type === "destructive" ? "destructive" : "outline"
							}
							className={cn(
								"rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200",
								// If destructive and icon-only, make it a small icon button with ghost styling
								action.type === "destructive" && action.isIconOnly
									? "p-2 h-10 w-10 bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300"
									: "px-4 py-2",
								// Regular destructive button styling
								action.type === "destructive" &&
									!action.isIconOnly &&
									"bg-red-500 hover:bg-red-600 text-white border-2 border-red-600 hover:border-red-700",
							)}
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									{!action.isIconOnly && (
										<span className="ml-2">Loading...</span>
									)}
								</>
							) : (
								<>
									<action.icon className="h-4 w-4" />
									{!action.isIconOnly && (
										<span className="ml-2">{action.label}</span>
									)}
								</>
							)}
						</Button>
					</motion.div>
				</div>
			);
		}

		// If multiple actions but no primary, show all actions in dropdown
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="rounded-full px-4 py-2"
							disabled={isLoading}
							onClick={(e) => e.stopPropagation()}
						>
							<MoreHorizontal className="h-4 w-4 mr-2" />
							Actions
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<AnimatePresence>
							{actions.map((action, index) => (
								<motion.div
									key={action.id}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.1, delay: index * 0.05 }}
								>
									<DropdownMenuItem
										onClick={(e) => {
											e.stopPropagation();
											action.onClick?.();
										}}
										disabled={action.disabled}
										className={cn(
											"flex items-center gap-3 cursor-pointer",
											action.type === "destructive" &&
												"text-red-600 hover:text-red-700 hover:bg-red-50",
										)}
										title={action.isIconOnly ? action.label : undefined}
									>
										<action.icon className="h-4 w-4" />
										<span>{action.label}</span>
									</DropdownMenuItem>
								</motion.div>
							))}
						</AnimatePresence>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	};

	// Return the component with dialogs
	return (
		<>
			{/* Action Menu UI */}
			{renderActionMenu()}

			{/* Dialogs */}
			<Suspense fallback={<div>Loading...</div>}>
				<DeleteSessionDialog
					open={deleteOpen}
					onOpenChange={setDeleteOpen}
					onDelete={async () => {
						setDeleteLoading(true);
						try {
							onDelete?.();
							setDeleteOpen(false);
						} catch (_) {
							// error handled in onDelete
						} finally {
							setDeleteLoading(false);
						}
					}}
					loading={deleteLoading}
				/>
			</Suspense>

			<Suspense fallback={<div>Loading...</div>}>
				<CancelSessionDialog
					open={cancelOpen}
					onOpenChange={(open) => {
						setCancelOpen(open);
						if (!open) setCancelError(null);
					}}
					onCancel={async () => {
						setCancelLoading(true);
						setCancelError(null);
						try {
							onCancel?.();
							setCancelOpen(false);
						} catch {
							setCancelError("Failed to cancel session. Please try again.");
						}
						setCancelLoading(false);
					}}
					loading={cancelLoading}
					error={cancelError}
				/>
			</Suspense>

			<Suspense fallback={<div>Loading...</div>}>
				<RescheduleSessionDialog
					open={rescheduleOpen}
					onOpenChange={(open) => {
						setRescheduleOpen(open);
						if (!open) setRescheduleError(null);
					}}
					onReschedule={async (e) => {
						e.preventDefault();
						if (!rescheduleDate || !rescheduleTime) {
							setRescheduleError("Please select both date and time.");
							return;
						}
						setRescheduleLoading(true);
						setRescheduleError(null);
						try {
							// Combine date and time into ISO string
							const [hours, minutes] = rescheduleTime.split(":");
							const newDate = new Date(rescheduleDate);
							newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
							const newStartTime = newDate.toISOString();

							onReschedule?.(newStartTime);
							setRescheduleOpen(false);
						} catch {
							setRescheduleError(
								"Failed to reschedule session. Please try again.",
							);
						}
						setRescheduleLoading(false);
					}}
					loading={rescheduleLoading}
					error={rescheduleError}
					date={rescheduleDate}
					time={rescheduleTime}
					setDate={setRescheduleDate}
					setTime={setRescheduleTime}
					clearError={() => setRescheduleError(null)}
				/>
			</Suspense>
		</>
	);
}
