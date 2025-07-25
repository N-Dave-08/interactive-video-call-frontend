import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
	steps: string[];
	currentStep: number;
	className?: string;
}

export type { StepperProps };

export default function Stepper({
	steps,
	currentStep,
	className,
}: StepperProps) {
	return (
		<motion.div
			className={cn(
				"flex flex-row items-center justify-center gap-4 md:gap-8 bg-white/60 backdrop-blur-3xl shadow-xl p-4 rounded-2xl",
				className,
			)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			{steps.map((label, idx) => {
				const isActive = idx === currentStep;
				const isCompleted = idx < currentStep;
				const isUpcoming = idx > currentStep;

				return (
					<motion.div
						key={label}
						className="flex flex-col items-center relative group min-w-[80px]"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							duration: 0.5,
							delay: idx * 0.1,
							ease: "easeOut",
						}}
						whileHover={{ scale: 1.05 }}
					>
						{/* Glow Effect for Active Step */}
						<AnimatePresence>
							{isActive && (
								<motion.div
									className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0 }}
									transition={{ duration: 0.3 }}
								>
									<motion.div
										className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-lg opacity-40"
										animate={{
											scale: [1, 1.2, 1],
											opacity: [0.4, 0.6, 0.4],
										}}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
											ease: "easeInOut",
										}}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Step Circle */}
						<motion.div
							className="flex items-center justify-center relative z-10 mb-3"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							<motion.div
								className={cn(
									"flex items-center justify-center w-12 h-12 rounded-full border-2 relative overflow-hidden cursor-pointer",
									{
										"bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 border-violet-300 text-white shadow-lg shadow-violet-500/30":
											isActive,
										"bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 border-emerald-300 text-white shadow-md shadow-emerald-500/20":
											isCompleted,
										"bg-white/90 backdrop-blur-sm border-slate-200 text-slate-400":
											isUpcoming,
									},
								)}
								animate={{
									scale: isActive ? 1.1 : 1,
									boxShadow: isActive
										? "0 10px 25px -5px rgba(139, 92, 246, 0.3)"
										: isCompleted
											? "0 4px 15px -3px rgba(16, 185, 129, 0.2)"
											: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
								}}
								transition={{ duration: 0.3, ease: "easeOut" }}
								whileHover={{
									scale: isActive ? 1.15 : 1.1,
									boxShadow: isActive
										? "0 15px 35px -5px rgba(139, 92, 246, 0.4)"
										: isCompleted
											? "0 8px 25px -3px rgba(16, 185, 129, 0.3)"
											: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
								}}
							>
								{/* Shimmer effect for active step */}
								<AnimatePresence>
									{isActive && (
										<motion.div
											className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
											initial={{ x: "-100%" }}
											animate={{ x: "200%" }}
											transition={{
												duration: 2,
												repeat: Number.POSITIVE_INFINITY,
												ease: "linear",
											}}
										/>
									)}
								</AnimatePresence>

								{/* Hover shimmer for upcoming steps */}
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-100/50 to-transparent -skew-x-12"
									initial={{ x: "-100%", opacity: 0 }}
									whileHover={{
										x: "200%",
										opacity: isUpcoming ? 1 : 0,
										transition: { duration: 0.6, ease: "easeOut" },
									}}
								/>

								<AnimatePresence mode="wait">
									{isCompleted ? (
										<motion.div
											key="check"
											initial={{ scale: 0, rotate: -180 }}
											animate={{ scale: 1, rotate: 0 }}
											exit={{ scale: 0, rotate: 180 }}
											transition={{ duration: 0.3, ease: "backOut" }}
										>
											<Check className="w-6 h-6 drop-shadow-sm" />
										</motion.div>
									) : isActive ? (
										<motion.div
											key="sparkles"
											initial={{ scale: 0, rotate: -180 }}
											animate={{
												scale: 1,
												rotate: 0,
											}}
											exit={{ scale: 0, rotate: 180 }}
											transition={{ duration: 0.3, ease: "backOut" }}
										>
											<motion.div
												animate={{ rotate: [0, 5, -5, 0] }}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													ease: "easeInOut",
												}}
											>
												<Sparkles className="w-6 h-6 drop-shadow-sm" />
											</motion.div>
										</motion.div>
									) : (
										<motion.span
											key="number"
											className="text-sm font-semibold"
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0 }}
											transition={{ duration: 0.2 }}
										>
											{idx + 1}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</motion.div>

						{/* Step Label */}
						<motion.div
							className={cn(
								"text-sm text-center font-medium min-w-[72px] px-2 whitespace-nowrap overflow-hidden text-ellipsis",
								{
									"text-slate-900 font-semibold": isActive,
									"text-slate-700": isCompleted,
									"text-slate-500": isUpcoming,
								},
							)}
							whileHover={{
								scale: 1.05,
								color: isUpcoming ? "#475569" : undefined,
							}}
							transition={{ duration: 0.2 }}
						>
							{`Stage ${idx + 1}`}
						</motion.div>

						{/* Horizontal Connector */}
						{idx < steps.length - 1 && (
							<div className="absolute top-6 left-full w-4 md:w-8 h-0.5 z-0">
								<motion.div
									className={cn("w-full h-full", {
										"bg-gradient-to-r from-emerald-400 to-teal-500":
											idx < currentStep,
										"bg-gradient-to-r from-violet-400 to-purple-500":
											idx === currentStep,
										"bg-slate-200": idx > currentStep,
									})}
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									transition={{
										duration: 0.5,
										delay: idx * 0.1 + 0.3,
										ease: "easeOut",
									}}
									style={{ originX: 0 }}
								/>

								{/* Animated flow effect */}
								<AnimatePresence>
									{idx <= currentStep && (
										<motion.div
											className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent"
											initial={{ x: "-100%" }}
											animate={{ x: "100%" }}
											transition={{
												duration: 3,
												repeat: Number.POSITIVE_INFINITY,
												ease: "linear",
											}}
										/>
									)}
								</AnimatePresence>
							</div>
						)}
					</motion.div>
				);
			})}
		</motion.div>
	);
}
