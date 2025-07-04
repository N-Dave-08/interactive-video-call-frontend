import { Check, Ellipsis, Palette, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChangeBackgroundSidebarProps {
	setBgUrl: (url: string) => void;
	currentBg: string;
}

const presetBackgrounds = [
	{
		name: "Mountain Vista",
		url: "/mountain-01.jpg",
		color: "from-blue-400 to-green-400",
	},
	{
		name: "Ocean Waves",
		url: "/ocean-waves.jpg",
		color: "from-blue-500 to-cyan-400",
	},
	{
		name: "Forest Path",
		url: "/forest.jpg",
		color: "from-green-500 to-emerald-400",
	},
	{
		name: "City Lights",
		url: "/city-lights.jpg",
		color: "from-purple-500 to-pink-400",
	},
];

export function ChangeBackgroundSidebar({
	setBgUrl,
	currentBg,
}: ChangeBackgroundSidebarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setIsUploading(true);
			try {
				const objectUrl = URL.createObjectURL(file);
				setBgUrl(objectUrl);
			} catch (error) {
				console.error("Error uploading file:", error);
			} finally {
				setIsUploading(false);
			}
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-lg py-0 overflow-hidden">
				<Collapsible open={isOpen} onOpenChange={setIsOpen}>
					<CollapsibleTrigger asChild>
						<motion.div
							whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
							whileTap={{ scale: 0.98 }}
							transition={{ duration: 0.2 }}
						>
							<Button
								variant="ghost"
								className="w-full justify-between p-4 hover:bg-transparent text-gray-800 font-medium"
							>
								<span className="flex items-center gap-2">
									<motion.div
										animate={{ rotate: isOpen ? 180 : 0 }}
										transition={{ duration: 0.3 }}
									>
										<Palette className="size-4" />
									</motion.div>
									Customize Background
								</span>
								<motion.span
									animate={{
										opacity: isOpen ? 0 : 1,
										rotate: isOpen ? 90 : 0,
									}}
									transition={{ duration: 0.2 }}
								>
									<Ellipsis />
								</motion.span>
							</Button>
						</motion.div>
					</CollapsibleTrigger>
					<CollapsibleContent forceMount>
						<AnimatePresence>
							{isOpen && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{
										duration: 0.3,
										ease: "easeInOut",
									}}
									style={{ overflow: "hidden" }}
								>
									<CardContent className="space-y-6 pt-4 pb-2">
										{/* Preset Backgrounds */}
										<motion.div
											className="grid grid-cols-2 gap-2"
											initial="hidden"
											animate="visible"
											variants={{
												hidden: { opacity: 0 },
												visible: {
													opacity: 1,
													transition: {
														staggerChildren: 0.1,
														delayChildren: 0.1,
													},
												},
											}}
										>
											{presetBackgrounds.map((bg) => (
												<Button
													key={bg.name}
													type="button"
													variant={currentBg === bg.url ? "default" : "outline"}
													className={`relative group overflow-hidden rounded-lg border-2 w-22 h-15 flex flex-col items-center justify-center p-0 ${currentBg === bg.url ? "border-primary shadow-lg scale-105" : "border-white/30 hover:border-white/60 hover:scale-102"}`}
													onClick={() => setBgUrl(bg.url)}
												>
													{/* Gradient Preview */}
													<div
														className={`absolute inset-0 h-full w-full bg-gradient-to-br ${bg.color} opacity-80 rounded-lg`}
													/>
													{/* Overlay */}
													<div className="absolute inset-0 bg-black/20 transition-colors rounded-lg" />
													{/* Check mark for active */}
													{currentBg === bg.url && (
														<div className="absolute top-1 right-1 bg-white rounded-full p-0.5 z-10">
															<Check className="size-3 text-green-600" />
														</div>
													)}
													{/* Name */}
													<span className="relative z-10 text-xs font-medium text-white truncate block px-2 text-center w-full">
														{bg.name}
													</span>
												</Button>
											))}
										</motion.div>

										{/* Custom Upload */}
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.4, duration: 0.3 }}
										>
											<motion.label
												htmlFor="sidebar-bg-upload"
												className="block cursor-pointer"
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														const input =
															document.getElementById("sidebar-bg-upload");
														if (input) input.click();
													}
												}}
											>
												<CardHeader className="px-0 pb-2 flex items-center gap-2 text-sm select-none cursor-pointer rounded transition">
													<CardTitle className="flex items-center gap-2 text-sm">
														<motion.div
															animate={{
																rotate: isUploading ? 360 : 0,
																scale: isUploading ? 1.1 : 1,
															}}
															transition={{
																rotate: {
																	duration: 1,
																	repeat: isUploading
																		? Number.POSITIVE_INFINITY
																		: 0,
																	ease: "linear",
																},
																scale: { duration: 0.2 },
															}}
														>
															<Upload className="size-4" />
														</motion.div>
														<motion.span
															key={isUploading ? "uploading" : "upload"}
															initial={{ opacity: 0, x: -10 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{ duration: 0.2 }}
														>
															{isUploading ? "Uploading..." : "Upload Custom"}
														</motion.span>
													</CardTitle>
												</CardHeader>
												<input
													id="sidebar-bg-upload"
													type="file"
													accept="image/*"
													onChange={handleFileChange}
													className="hidden"
													disabled={isUploading}
												/>
											</motion.label>
										</motion.div>
									</CardContent>
								</motion.div>
							)}
						</AnimatePresence>
					</CollapsibleContent>
				</Collapsible>
			</Card>
		</motion.div>
	);
}
