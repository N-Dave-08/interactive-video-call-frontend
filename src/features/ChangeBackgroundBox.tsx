import { Palette } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const presetBackgrounds = [
	{
		name: "Cloudy Sky",
		url: "/backgrounds/cloud-bg.jpg",
		color: "from-blue-200 to-white",
	},
	{
		name: "Rainbow Slide",
		url: "/backgrounds/rainbow-slide-bg.jpg",
		color: "from-pink-400 to-yellow-300",
	},
	{
		name: "Starry Lights",
		url: "/backgrounds/stars-lights-bg.jpg",
		color: "from-indigo-700 to-yellow-100",
	},
	{
		name: "Sun & Rainbow",
		url: "/backgrounds/sun-rainbow-bg.jpg",
		color: "from-yellow-200 to-pink-300",
	},
];

export default function ChangeBackgroundBox({
	currentBg,
	setBgUrl,
}: {
	currentBg: string;
	setBgUrl: (url: string) => void;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
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

	if (!isExpanded) {
		return (
			<motion.div
				className="bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden fixed bottom-4 right-4 z-50 w-14 h-14 p-0 flex items-center justify-center"
				layout
				initial={false}
			>
				<motion.div
					className="relative size-10 flex items-center justify-center cursor-pointer"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 300, damping: 20 }}
					onClick={() => setIsExpanded(true)}
				>
					<motion.div
						className="bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg size-10 flex items-center justify-center"
						animate={{ scale: 1 }}
					>
						<Palette className="text-white size-6" />
					</motion.div>
				</motion.div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className="bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden fixed bottom-4 right-4 z-50 w-80"
			layout
			initial={true}
		>
			<div className="p-3 space-y-3">
				<div className="flex justify-between items-center">
					<div className="bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl size-12 flex items-center justify-center shadow-lg">
						<Palette className="text-white size-6" />
					</div>
					<span className="font-semibold text-gray-500 text-sm">
						Change Background
					</span>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6 text-gray-600 hover:text-gray-900"
						onClick={() => setIsExpanded(false)}
						aria-label="Close background changer"
					>
						<svg width="12" height="12" viewBox="0 0 20 20" fill="none">
							<title>Close</title>
							<path
								d="M5 8l5 5 5-5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Button>
				</div>
				<div className="grid grid-cols-2 gap-2">
					{presetBackgrounds.map((bg) => (
						<Button
							key={bg.name}
							type="button"
							variant={currentBg === bg.url ? "default" : "outline"}
							className={`relative group overflow-hidden rounded-lg border-2 w-full h-15 flex flex-col items-center justify-center p-0 ${currentBg === bg.url ? "border-primary shadow-lg scale-105" : "border-white/30 hover:border-white/60 hover:scale-102"}`}
							onClick={() => setBgUrl(bg.url)}
						>
							<div
								className={`absolute inset-0 h-full w-full bg-gradient-to-br ${bg.color} opacity-80 rounded-lg`}
							/>
							<div className="absolute inset-0 bg-black/20 transition-colors rounded-lg" />
							{currentBg === bg.url && (
								<div className="absolute top-1 right-1 bg-white rounded-full p-0.5 z-10">
									<svg
										className="size-3 text-green-600"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										viewBox="0 0 24 24"
									>
										<title>Selected</title>
										<path
											d="M5 13l4 4L19 7"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							)}
							<span className="relative z-10 text-xs font-medium text-white truncate block px-2 text-center w-full">
								{bg.name}
							</span>
						</Button>
					))}
				</div>
				<div>
					<label htmlFor="room-bg-upload" className="block cursor-pointer">
						<div className="flex items-center gap-2 text-sm select-none cursor-pointer rounded transition px-0 pb-2">
							<svg
								className={`size-4 ${isUploading ? "animate-spin" : ""}`}
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<title>Upload</title>
								<path
									d="M4 4v5h.582M20 20v-5h-.581M5 9A7.003 7.003 0 0112 5c1.657 0 3.156.576 4.354 1.536M19 15a7.003 7.003 0 01-7 4c-1.657 0-3.156-.576-4.354-1.536"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span>{isUploading ? "Uploading..." : "Upload Custom"}</span>
						</div>
						<input
							id="room-bg-upload"
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
							disabled={isUploading}
						/>
					</label>
				</div>
			</div>
		</motion.div>
	);
}
