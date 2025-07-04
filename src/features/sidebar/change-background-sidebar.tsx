import { Check, Ellipsis, Palette, Upload } from "lucide-react";
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
		<Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-lg py-0">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<Button
						variant="ghost"
						className="w-full justify-between p-4 hover:bg-white/10 text-gray-800 font-medium"
					>
						<span className="flex items-center gap-2">
							<Palette className="size-4" />
							Customize Background
						</span>
						<span
							className={`transition-transform duration-200 ${isOpen ? "hidden" : ""}`}
						>
							<Ellipsis />
						</span>
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<CardContent className="space-y-6 pt-4 pb-2">
						{/* Preset Backgrounds */}
						<div className="grid grid-cols-2 gap-2">
							{presetBackgrounds.map((bg) => (
								<Button
									key={bg.name}
									type="button"
									variant={currentBg === bg.url ? "default" : "outline"}
									className={`relative group overflow-hidden rounded-lg border-2 p-0 h-16 flex flex-col items-stretch justify-end ${currentBg === bg.url ? "border-primary shadow-lg scale-105" : "border-white/30 hover:border-white/60 hover:scale-102"}`}
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
									<span className="relative z-10 text-xs font-medium text-white truncate block px-2 pb-1 pt-8 text-center">
										{bg.name}
									</span>
								</Button>
							))}
						</div>
						{/* Custom Upload */}
						<div>
							<label
								htmlFor="sidebar-bg-upload"
								className="block cursor-pointer"
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										const input = document.getElementById("sidebar-bg-upload");
										if (input) input.click();
									}
								}}
							>
								<CardHeader className="px-0 pb-2 flex items-center gap-2 text-sm select-none cursor-pointer rounded transition">
									<CardTitle className="flex items-center gap-2 text-sm">
										<Upload className="size-4" />
										<span>
											{isUploading ? "Uploading..." : "Upload Custom"}
										</span>
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
							</label>
						</div>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
