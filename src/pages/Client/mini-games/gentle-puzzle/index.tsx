import { Icon } from "@iconify/react";
import { RotateCcw, Star } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import MiniGameLayout from "../MiniGameLayout";

const shapes = [
	{
		id: "circle",
		color: "from-blue-400 to-blue-600",
		label: "Circle",
		emoji: <Icon icon="fluent-emoji:blue-circle" />,
	},
	{
		id: "square",
		color: "from-green-400 to-green-600",
		label: "Square",
		emoji: <Icon icon="fluent-emoji:green-square" />,
	},
	{
		id: "triangle",
		color: "from-pink-400 to-pink-600",
		label: "Triangle",
		emoji: <Icon icon="fluent-emoji:red-triangle-pointed-up" />,
	},
	{
		id: "star",
		color: "from-yellow-400 to-yellow-600",
		label: "Star",
		emoji: <Icon icon="fluent-emoji:star" />,
	},
	{
		id: "heart",
		color: "from-red-400 to-red-600",
		label: "Heart",
		emoji: <Icon icon="fluent-emoji:red-heart" />,
	},
];

function Shape({
	id,
	color,
	dragging,
	animate,
}: {
	id: string;
	color: string;
	dragging: boolean;
	animate?: boolean;
}) {
	const baseClasses = `shadow-2xl transition-all duration-300 ${
		dragging
			? "opacity-60 scale-110 rotate-12"
			: "hover:scale-105 hover:rotate-3"
	} ${animate ? "animate-bounce" : ""}`;

	if (id === "circle")
		return (
			<div
				className={`w-24 h-24 rounded-full bg-gradient-to-br ${color} ${baseClasses} border-4 border-white`}
			>
				<div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
					<div className="w-6 h-6 bg-white/60 rounded-full" />
				</div>
			</div>
		);

	if (id === "square")
		return (
			<div
				className={`w-24 h-24 bg-gradient-to-br ${color} ${baseClasses} border-4 border-white rounded-lg`}
			>
				<div className="w-full h-full bg-white/20 flex items-center justify-center rounded-lg">
					<div className="w-8 h-8 bg-white/60 rounded" />
				</div>
			</div>
		);

	if (id === "triangle")
		return (
			<div
				className={`relative ${baseClasses}`}
				style={{ width: 96, height: 96 }}
			>
				<svg
					width="96"
					height="96"
					viewBox="0 0 96 96"
					className="drop-shadow-2xl"
				>
					<title>Triangle</title>
					<defs>
						<linearGradient
							id="triangleGrad"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop offset="0%" stopColor="#f472b6" />
							<stop offset="100%" stopColor="#db2777" />
						</linearGradient>
					</defs>
					<polygon
						points="48,12 84,84 12,84"
						fill="url(#triangleGrad)"
						stroke="white"
						strokeWidth="4"
					/>
					<polygon points="48,24 72,72 24,72" fill="white" fillOpacity="0.2" />
				</svg>
			</div>
		);

	if (id === "star")
		return (
			<div className={`relative ${baseClasses}`}>
				<svg
					width="96"
					height="96"
					viewBox="0 0 96 96"
					className="drop-shadow-2xl"
				>
					<title>Star</title>
					<defs>
						<linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#facc15" />
							<stop offset="100%" stopColor="#ca8a04" />
						</linearGradient>
					</defs>
					<polygon
						points="48,12 57.6,38.4 86.4,38.4 62.4,57.6 72,84 48,67.2 24,84 33.6,57.6 9.6,38.4 38.4,38.4"
						fill="url(#starGrad)"
						stroke="white"
						strokeWidth="4"
					/>
					<polygon
						points="48,20 54,40 72,40 58,52 64,72 48,60 32,72 38,52 24,40 42,40"
						fill="white"
						fillOpacity="0.3"
					/>
				</svg>
			</div>
		);

	if (id === "heart")
		return (
			<div className={`relative ${baseClasses}`}>
				<svg
					width="96"
					height="96"
					viewBox="0 0 96 96"
					className="drop-shadow-2xl"
				>
					<title>Heart</title>
					<defs>
						<linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#f87171" />
							<stop offset="100%" stopColor="#dc2626" />
						</linearGradient>
					</defs>
					<path
						d="M48 84s-30-20-30-40c0-11.046 8.954-20 20-20 6.904 0 12.5 5.596 12.5 12.5 0-6.904 5.596-12.5 12.5-12.5 11.046 0 20 8.954 20 20 0 20-30 40-30 40z"
						fill="url(#heartGrad)"
						stroke="white"
						strokeWidth="4"
					/>
					<path
						d="M48 72s-24-16-24-32c0-8.837 7.163-16 16-16 5.523 0 10 4.477 10 10 0-5.523 4.477-10 10-10 8.837 0 16 7.163 16 16 0 16-24 32-24 32z"
						fill="white"
						fillOpacity="0.2"
					/>
				</svg>
			</div>
		);

	return null;
}

function ShapeOutline({ id, isHovered }: { id: string; isHovered: boolean }) {
	const hoverClasses = isHovered
		? "border-purple-400 bg-purple-100/50 scale-110"
		: "border-gray-300";

	if (id === "circle")
		return (
			<div
				className={`w-24 h-24 rounded-full border-4 border-dashed ${hoverClasses} transition-all duration-300 bg-white/50 backdrop-blur-sm`}
			>
				<div className="w-full h-full rounded-full flex items-center justify-center">
					<Icon
						icon="fluent-emoji:blue-circle"
						className="text-2xl opacity-50"
					/>
				</div>
			</div>
		);

	if (id === "square")
		return (
			<div
				className={`w-24 h-24 border-4 border-dashed ${hoverClasses} transition-all duration-300 bg-white/50 backdrop-blur-sm rounded-lg`}
			>
				<div className="w-full h-full flex items-center justify-center">
					<Icon
						icon="fluent-emoji:green-square"
						className="text-2xl opacity-50"
					/>
				</div>
			</div>
		);

	if (id === "triangle")
		return (
			<div className="relative w-24 h-24 flex items-center justify-center">
				<svg width="96" height="96" viewBox="0 0 96 96">
					<title>Triangle Outline</title>
					<polygon
						points="48,12 84,84 12,84"
						fill="rgba(255,255,255,0.5)"
						stroke={isHovered ? "#a855f7" : "#d1d5db"}
						strokeWidth="4"
						strokeDasharray="12,8"
						className="transition-all duration-300"
					/>
					<foreignObject x="32" y="40" width="32" height="32">
						<Icon
							icon="fluent-emoji:red-triangle-pointed-up"
							className="text-2xl opacity-50"
						/>
					</foreignObject>
				</svg>
			</div>
		);

	if (id === "star")
		return (
			<div className="relative w-24 h-24 flex items-center justify-center">
				<svg width="96" height="96" viewBox="0 0 96 96">
					<title>Star Outline</title>
					<polygon
						points="48,12 57.6,38.4 86.4,38.4 62.4,57.6 72,84 48,67.2 24,84 33.6,57.6 9.6,38.4 38.4,38.4"
						fill="rgba(255,255,255,0.5)"
						stroke={isHovered ? "#a855f7" : "#d1d5db"}
						strokeWidth="4"
						strokeDasharray="12,8"
						className="transition-all duration-300"
					/>
					<foreignObject x="32" y="32" width="32" height="32">
						<Icon icon="fluent-emoji:star" className="text-2xl opacity-50" />
					</foreignObject>
				</svg>
			</div>
		);

	if (id === "heart")
		return (
			<div className="relative w-24 h-24 flex items-center justify-center">
				<svg width="96" height="96" viewBox="0 0 96 96">
					<title>Heart Outline</title>
					<path
						d="M48 84s-30-20-30-40c0-11.046 8.954-20 20-20 6.904 0 12.5 5.596 12.5 12.5 0-6.904 5.596-12.5 12.5-12.5 11.046 0 20 8.954 20 20 0 20-30 40-30 40z"
						fill="rgba(255,255,255,0.5)"
						stroke={isHovered ? "#a855f7" : "#d1d5db"}
						strokeWidth="4"
						strokeDasharray="12,8"
						className="transition-all duration-300"
					/>
					<foreignObject x="32" y="32" width="32" height="32">
						<Icon
							icon="fluent-emoji:red-heart"
							className="text-2xl opacity-50"
						/>
					</foreignObject>
				</svg>
			</div>
		);

	return null;
}

// --- AnimatedGradientBackground component ---

// --- End AnimatedGradientBackground ---

// Add sound effect paths
const GRAB_SOUND = "/sound-effects/general/casual-click.mp3";
const PLACE_SOUND = "/sound-effects/general/minimal-click.mp3";
const CELEBRATION_SOUND = "/sound-effects/yay-celebration.mp3";

export default function GentlePuzzle() {
	const [placed, setPlaced] = useState<{ [k: string]: boolean }>({});
	const [dragging, setDragging] = useState<string | null>(null);
	const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [animateId, setAnimateId] = useState<string | null>(null);

	useEffect(() => {
		if (success) {
			try {
				const audio = new Audio(CELEBRATION_SOUND);
				audio.play().catch(() => {});
			} catch {}
		}
	}, [success]);

	const handleDrop =
		(shapeId: string) => (e: React.DragEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (dragging === shapeId) {
				setPlaced((prev) => ({ ...prev, [shapeId]: true }));
				setDragging(null);
				setHoveredTarget(null);
				setAnimateId(shapeId);

				// Play place sound
				try {
					const audio = new Audio(PLACE_SOUND);
					audio.play().catch(() => {});
				} catch {}

				setTimeout(() => setAnimateId(null), 1000);
				setTimeout(() => {
					if (Object.keys(placed).length + 1 === shapes.length) {
						setSuccess(true);
					}
				}, 500);
			}
		};

	const handleReset = () => {
		setPlaced({});
		setSuccess(false);
		setAnimateId(null);
		setDragging(null);
		setHoveredTarget(null);
	};

	const completedCount = Object.keys(placed).length;

	return (
		<MiniGameLayout>
			<div className="flex flex-col items-center justify-center min-h-screen w-full p-2">
				{/* Top Card: Header, Instructions, Progress */}
				<div className="w-full max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl border-2 border-white/70 p-6 mt-6 mb-4">
					<div className="flex flex-col items-center gap-2">
						<div className="flex items-center justify-center gap-2 mb-2">
							<Star className="text-yellow-400 animate-spin" size={28} />
							<h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
								<Icon
									icon="fluent-emoji:direct-hit"
									className="inline w-7 h-7 mr-1 align-middle"
								/>{" "}
								Shape Sorting Adventure!{" "}
								<Icon
									icon="fluent-emoji:direct-hit"
									className="inline w-7 h-7 ml-1 align-middle"
								/>
							</h2>
						</div>
						<p className="text-base md:text-lg font-semibold text-purple-700 text-center mb-1">
							<Icon
								icon="twemoji:bullseye"
								className="inline w-6 h-6 mr-1 align-middle"
							/>
							Drag each colorful shape to its matching outline!
							<Icon
								icon="twemoji:bullseye"
								className="inline w-6 h-6 ml-1 align-middle"
							/>
						</p>
						<div className="flex items-center justify-center gap-2 mb-2">
							<div className="bg-white rounded-full px-4 py-1 shadow border border-purple-200">
								<span className="text-sm font-bold text-purple-600">
									Progress: {completedCount} / {shapes.length}{" "}
									<Icon
										icon="fluent-emoji:sparkles"
										className="inline w-4 h-4 align-middle"
									/>
								</span>
							</div>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-3 shadow-inner mb-1">
							<div
								className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
								style={{ width: `${(completedCount / shapes.length) * 100}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Main Card: Pick and Drop Areas */}
				<div className="w-full max-w-3xl mx-auto bg-white/80 rounded-2xl shadow-lg border border-white/60 p-4 flex flex-col gap-4 mb-4">
					{/* Pick Area */}
					<div>
						<h3 className="text-lg font-bold text-center mb-2 text-purple-700">
							Pick a Shape to Drag!
						</h3>
						<div className="flex flex-wrap justify-center gap-6 p-2">
							{shapes.map((shape) =>
								!placed[shape.id] ? (
									<div key={shape.id} className="relative">
										<button
											draggable
											aria-label={`Drag ${shape.label}`}
											onDragStart={() => {
												setDragging(shape.id);
												try {
													const audio = new Audio(GRAB_SOUND);
													audio.play().catch(() => {});
												} catch {}
											}}
											onDragEnd={() => setDragging(null)}
											className="cursor-grab active:cursor-grabbing focus:outline-none bg-transparent border-none p-2 rounded-2xl hover:bg-white/50 transition-all duration-300"
											type="button"
										>
											<Shape
												id={shape.id}
												color={shape.color}
												dragging={dragging === shape.id}
											/>
										</button>
										<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow border border-purple-200">
											<span className="text-xs font-bold text-purple-600">
												{shape.emoji}
											</span>
										</div>
									</div>
								) : (
									<div
										key={shape.id}
										className="w-24 h-24 flex items-center justify-center"
									>
										<div className="text-3xl animate-pulse">
											<Icon
												icon="fluent-emoji:sparkles"
												className="inline w-8 h-8"
											/>
										</div>
									</div>
								),
							)}
						</div>
					</div>

					{/* Drop Area */}
					<div>
						<h3 className="text-lg font-bold text-center mb-2 text-purple-700">
							Drop Shapes Here!
						</h3>
						<div className="flex flex-wrap justify-center gap-6 p-2">
							{shapes.map((shape) => (
								<div key={shape.id} className="relative">
									<button
										type="button"
										onDragOver={(e) => {
											e.preventDefault();
											setHoveredTarget(shape.id);
										}}
										onDragLeave={() => setHoveredTarget(null)}
										onDrop={handleDrop(shape.id)}
										className="w-28 h-28 flex items-center justify-center transition-all duration-300 bg-transparent border-none p-2 rounded-2xl"
										aria-label={`Drop ${shape.label} here`}
									>
										{placed[shape.id] ? (
											<Shape
												id={shape.id}
												color={shape.color}
												dragging={false}
												animate={animateId === shape.id}
											/>
										) : (
											<ShapeOutline
												id={shape.id}
												isHovered={hoveredTarget === shape.id}
											/>
										)}
									</button>
									<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow border border-blue-200">
										<span className="text-xs font-bold text-blue-600">
											{shape.label}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Success message */}
				{success && (
					<div className="text-center mb-4 animate-bounce">
						<div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-6 shadow-2xl border-4 border-white">
							<div className="text-4xl mb-2">
								<Icon
									icon="fluent-emoji:party-popper"
									className="inline w-10 h-10"
								/>
							</div>
							<div className="text-2xl font-black mb-2">
								FANTASTIC JOB!{" "}
								<Icon
									icon="fluent-emoji:glowing-star"
									className="inline w-7 h-7"
								/>
							</div>
							<div className="text-lg font-bold">
								You sorted all the shapes perfectly!{" "}
								<Icon
									icon="fluent-emoji:confetti-ball"
									className="inline w-7 h-7"
								/>
							</div>
							<div className="flex justify-center gap-2 mt-2 text-xl">
								<Icon icon="fluent-emoji:star" className="inline w-6 h-6" />{" "}
								<Icon icon="fluent-emoji:balloon" className="inline w-6 h-6" />{" "}
								<Icon icon="fluent-emoji:star" className="inline w-6 h-6" />{" "}
								<Icon icon="fluent-emoji:balloon" className="inline w-6 h-6" />{" "}
								<Icon icon="fluent-emoji:star" className="inline w-6 h-6" />
							</div>
						</div>
					</div>
				)}

				{/* Reset button */}
				<div className="flex justify-center mb-8">
					<button
						type="button"
						onClick={handleReset}
						className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-black text-lg shadow-2xl border-4 border-white hover:scale-105 transition-all duration-300 active:scale-95"
					>
						<Icon
							icon="fluent-emoji:repeat-button"
							className="inline w-6 h-6 mx-1"
						/>
						<RotateCcw size={20} /> Try Again!
						<Icon
							icon="fluent-emoji:repeat-button"
							className="inline w-6 h-6 mx-1"
						/>
					</button>
				</div>
			</div>
		</MiniGameLayout>
	);
}
