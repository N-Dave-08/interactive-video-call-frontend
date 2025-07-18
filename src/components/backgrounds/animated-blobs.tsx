import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBlobProps {
	className?: string;
	size?: string; // e.g., "h-20 w-20"
	color?: string; // e.g., "bg-purple-300"
	position?: string; // e.g., "top-10 left-20"
	animationDelay?: number; // in seconds
	animationDuration?: number; // in seconds
	animationType?: "float1" | "float2" | "float3";
}

export function AnimatedBlob({
	className,
	size = "h-24 w-24",
	color = "bg-purple-300",
	position = "top-1/4 left-1/4",
	animationDelay = 0,
	animationDuration = 20,
	animationType = "float1",
}: AnimatedBlobProps) {
	const floatVariants = {
		float1: {
			y: ["0%", "20%", "10%", "0%"],
			x: ["0%", "10%", "-15%", "0%"],
			scale: [1, 1.05, 0.95, 1.02, 1],
			opacity: [0.6, 0.9, 0.6],
		},
		float2: {
			y: ["0%", "-20%", "15%", "0%"],
			x: ["0%", "-10%", "20%", "0%"],
			scale: [1, 0.98, 1.03, 1],
			opacity: [0.6, 0.9, 0.6],
		},
		float3: {
			y: ["0%", "15%", "-10%", "0%"],
			x: ["0%", "20%", "-10%", "0%"],
			scale: [1, 1.01, 0.99, 1],
			opacity: [0.6, 0.9, 0.6],
		},
	};

	return (
		<motion.div
			className={cn(
				"absolute rounded-full mix-blend-multiply filter blur-xl",
				size,
				color,
				position,
				className,
			)}
			variants={floatVariants}
			animate={animationType}
			transition={{
				duration: animationDuration,
				ease: "easeInOut",
				repeat: Number.POSITIVE_INFINITY,
				repeatType: "reverse",
				delay: animationDelay,
			}}
		/>
	);
}
