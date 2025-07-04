import type * as React from "react";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps {
	children: React.ReactNode;
	tailPosition?: "top" | "bottom" | "left" | "right";
	tailOffset?: "start" | "center" | "end";
	className?: string;
	variant?: "default" | "primary" | "secondary" | "destructive";
}

export function SpeechBubble({
	children,
	tailPosition = "bottom",
	tailOffset = "start",
	className,
	variant = "default",
	...props
}: SpeechBubbleProps) {
	const variants = {
		default: "bg-background border border-border text-foreground",
		primary: "bg-primary text-primary-foreground",
		secondary: "bg-secondary text-secondary-foreground",
		destructive: "bg-destructive text-destructive-foreground",
	};

	const tailClasses = {
		top: {
			container: "mb-2",
			tail: "absolute -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent",
			tailColor: {
				default: "border-b-border",
				primary: "border-b-primary",
				secondary: "border-b-secondary",
				destructive: "border-b-destructive",
			},
			tailInner:
				"absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent",
			tailInnerColor: {
				default: "border-b-background",
				primary: "border-b-primary",
				secondary: "border-b-secondary",
				destructive: "border-b-destructive",
			},
			offset: {
				start: "left-4",
				center: "left-1/2 -translate-x-1/2",
				end: "right-4",
			},
		},
		bottom: {
			container: "mt-2",
			tail: "absolute -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent",
			tailColor: {
				default: "border-t-border",
				primary: "border-t-primary",
				secondary: "border-t-secondary",
				destructive: "border-t-destructive",
			},
			tailInner:
				"absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent",
			tailInnerColor: {
				default: "border-t-background",
				primary: "border-t-primary",
				secondary: "border-t-secondary",
				destructive: "border-t-destructive",
			},
			offset: {
				start: "left-4",
				center: "left-1/2 -translate-x-1/2",
				end: "right-4",
			},
		},
		left: {
			container: "mr-2",
			tail: "absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent",
			tailColor: {
				default: "border-r-border",
				primary: "border-r-primary",
				secondary: "border-r-secondary",
				destructive: "border-r-destructive",
			},
			tailInner:
				"absolute -left-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent",
			tailInnerColor: {
				default: "border-r-background",
				primary: "border-r-primary",
				secondary: "border-r-secondary",
				destructive: "border-r-destructive",
			},
			offset: {
				start: "top-4",
				center: "top-1/2 -translate-y-1/2",
				end: "bottom-4",
			},
		},
		right: {
			container: "ml-2",
			tail: "absolute -right-2 top-4 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent",
			tailColor: {
				default: "border-l-border",
				primary: "border-l-primary",
				secondary: "border-l-secondary",
				destructive: "border-l-destructive",
			},
			tailInner:
				"absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-l-6 border-t-transparent border-b-transparent",
			tailInnerColor: {
				default: "border-l-background",
				primary: "border-l-primary",
				secondary: "border-l-secondary",
				destructive: "border-l-destructive",
			},
			offset: {
				start: "top-4",
				center: "top-1/2 -translate-y-1/2",
				end: "bottom-4",
			},
		},
	};

	const currentTail = tailClasses[tailPosition];

	return (
		<div className={cn("relative inline-block", currentTail.container)}>
			<div
				className={cn(
					"relative rounded-lg px-4 py-3 shadow-sm",
					variants[variant],
					className,
				)}
				{...props}
			>
				{children}

				{/* Outer tail (border) */}
				<div
					className={cn(
						currentTail.tail,
						currentTail.tailColor[variant],
						currentTail.offset[tailOffset],
					)}
				/>

				{/* Inner tail (fill) - only for default variant with border */}
				{variant === "default" && (
					<div
						className={cn(
							currentTail.tailInner,
							currentTail.tailInnerColor[variant],
							currentTail.offset[tailOffset],
						)}
					/>
				)}
			</div>
		</div>
	);
}
