import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerticalStepperProps {
	steps: string[];
	currentStep: number;
	className?: string;
}

export default function VerticalStepper({
	steps,
	currentStep,
	className,
}: VerticalStepperProps) {
	return (
		<div className={cn("flex flex-col", className)}>
			{steps.map((label, idx) => {
				const isActive = idx === currentStep;
				const isCompleted = idx < currentStep;
				const isUpcoming = idx > currentStep;

				return (
					<div key={label} className="flex items-start relative group">
						{/* Glow Effect for Active Step */}
						{isActive && (
							<div className="absolute left-5 top-5 w-0 h-0 -translate-x-1/2 -translate-y-1/2">
								<div className="w-6 h-6 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-md opacity-60 animate-pulse" />
							</div>
						)}

						{/* Step Circle */}
						<div className="flex items-center justify-center relative z-10">
							<div
								className={cn(
									"flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ease-in-out relative overflow-hidden",
									{
										// Active step - Vibrant gradient with glow
										"bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 border-violet-300 text-white shadow-lg shadow-violet-500/30 scale-110":
											isActive,
										// Completed step - Success gradient
										"bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 border-emerald-300 text-white shadow-md shadow-emerald-500/20":
											isCompleted,
										// Upcoming step - Modern glass effect
										"bg-white/80 backdrop-blur-sm border-slate-200 text-slate-400 hover:border-violet-200 hover:bg-white/90":
											isUpcoming,
									},
								)}
							>
								{/* Shimmer effect for active step */}
								{isActive && (
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
								)}

								{isCompleted ? (
									<Check className="w-5 h-5 drop-shadow-sm" />
								) : isActive ? (
									<Sparkles className="w-5 h-5 drop-shadow-sm" />
								) : (
									<span className="text-sm font-semibold">{idx + 1}</span>
								)}
							</div>
						</div>

						{/* Step Content */}
						<div className="ml-4 pb-8 flex-1">
							<div
								className={cn(
									"text-sm font-medium transition-all duration-200",
									{
										"text-slate-900 font-semibold": isActive,
										"text-slate-700": isCompleted,
										"text-slate-500": isUpcoming,
									},
								)}
							>
								{label}
							</div>

							{/* Status Indicator */}
							{isActive && (
								<div className="flex items-center gap-1 text-xs text-violet-600 mt-1 animate-in fade-in-0 slide-in-from-left-2 duration-300">
									<div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
									In progress
								</div>
							)}

							{isCompleted && (
								<div className="text-xs text-emerald-600 mt-1 font-medium">
									Completed
								</div>
							)}
						</div>

						{/* Modern Connector Line */}
						{idx < steps.length - 1 && (
							<div className="absolute left-5 top-10 w-0.5 h-8 overflow-hidden">
								<div
									className={cn("w-full h-full transition-all duration-500", {
										"bg-gradient-to-b from-emerald-400 to-teal-500":
											idx < currentStep,
										"bg-gradient-to-b from-violet-400 to-purple-500":
											idx === currentStep,
										"bg-slate-200": idx > currentStep,
									})}
								/>
								{/* Animated flow effect */}
								{idx <= currentStep && (
									<div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent animate-flow" />
								)}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
