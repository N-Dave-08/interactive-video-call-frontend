import { Icon } from "@iconify/react";
import { RotateCcw } from "lucide-react";
import type React from "react";
import { useState } from "react";

// Define interface for body part
interface BodyPart {
	id: string;
	name: string;
	cx?: number;
	cy?: number;
	r?: number;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	rotate?: number;
}

// Define interface for selected parts state
interface SelectedParts {
	[key: string]: { pain: boolean; touch: boolean };
}

interface BodyMapProps {
	onBodyPartClick?: (partId: string, view: "front" | "back") => void;
	onSelectionChange?: (front: SelectedParts, back: SelectedParts) => void;
	onSkip?: () => void;
	gender?: "male" | "female"; // <-- add this
}

const BodyMap: React.FC<BodyMapProps> = ({
	onBodyPartClick,
	onSelectionChange,
	onSkip,
	gender = "male", // <-- default to male
}) => {
	const [frontSelectedParts, setFrontSelectedParts] = useState<SelectedParts>(
		{},
	);
	const [backSelectedParts, setBackSelectedParts] = useState<SelectedParts>({});
	const [mode, setMode] = useState<"pain" | "touch">("pain");
	const [hoveredPart, setHoveredPart] = useState<string | null>(null);

	// Define body parts for front and back views
	const frontBodyParts: BodyPart[] = [
		{ id: "leftEye", name: "Left Eye", cx: 85, cy: 88, r: 5 },
		{ id: "rightEye", name: "Right Eye", cx: 114, cy: 88, r: 5 },
		{ id: "nose", name: "Nose", x: 96, y: 88, width: 8, height: 12 },
		{ id: "mouth", name: "Mouth", x: 92, y: 102, width: 16, height: 8 },
		{ id: "leftEar", name: "Left Ear", cx: 64, cy: 94, r: 7 },
		{ id: "rightEar", name: "Right Ear", cx: 134, cy: 94, r: 7 },
		{ id: "neck", name: "Neck", x: 90, y: 114, width: 20, height: 14 },
		{ id: "leftShoulder", name: "Left Shoulder", cx: 78, cy: 130, r: 10 },
		{ id: "rightShoulder", name: "Right Shoulder", cx: 120, cy: 130, r: 10 },
		{ id: "chest", name: "Chest", x: 80, y: 134, width: 40, height: 40 },
		{
			id: "leftArm",
			name: "Left Arm",
			x: 58,
			y: 138,
			width: 15,
			height: 50,
			rotate: 20,
		},
		{
			id: "rightArm",
			name: "Right Arm",
			x: 128,
			y: 138,
			width: 15,
			height: 50,
			rotate: -20,
		},
		{ id: "leftHand", name: "Left Hand", cx: 52, cy: 204, r: 14 },
		{ id: "rightHand", name: "Right Hand", cx: 148, cy: 204, r: 14 },
		{ id: "stomach", name: "Stomach", x: 80, y: 175, width: 40, height: 36 },
		{
			id: "private",
			name: "Private Area",
			x: 90,
			y: 220,
			width: 20,
			height: 15,
		},
		{ id: "leftHip", name: "Left Hip", cx: 85, cy: 218, r: 12 },
		{ id: "rightHip", name: "Right Hip", cx: 115, cy: 218, r: 12 },
		{
			id: "leftThigh",
			name: "Left Thigh",
			x: 75,
			y: 230,
			width: 20,
			height: 34,
		},
		{
			id: "rightThigh",
			name: "Right Thigh",
			x: 105,
			y: 230,
			width: 20,
			height: 34,
		},
		{ id: "leftKnee", name: "Left Knee", cx: 85, cy: 270, r: 10 },
		{ id: "rightKnee", name: "Right Knee", cx: 115, cy: 270, r: 10 },
		{ id: "leftShin", name: "Left Shin", x: 76, y: 280, width: 15, height: 26 },
		{
			id: "rightShin",
			name: "Right Shin",
			x: 108,
			y: 280,
			width: 15,
			height: 26,
		},
		{ id: "leftFoot", name: "Left Foot", x: 70, y: 306, width: 24, height: 15 },
		{
			id: "rightFoot",
			name: "Right Foot",
			x: 107,
			y: 306,
			width: 24,
			height: 15,
		},
	];

	const backBodyParts: BodyPart[] = [
		{ id: "backHead", name: "Back of Head", cx: 100, cy: 76, r: 34 },
		{ id: "leftEar", name: "Left Ear", cx: 64, cy: 94, r: 7 },
		{ id: "rightEar", name: "Right Ear", cx: 136, cy: 94, r: 7 },
		{ id: "neck", name: "Neck", x: 90, y: 114, width: 20, height: 14 },
		{ id: "leftShoulder", name: "Left Shoulder", cx: 78, cy: 130, r: 10 },
		{ id: "rightShoulder", name: "Right Shoulder", cx: 120, cy: 130, r: 10 },
		{
			id: "upperBack",
			name: "Upper Back",
			x: 78,
			y: 136,
			width: 46,
			height: 40,
		},
		{
			id: "leftArm",
			name: "Left Arm",
			x: 58,
			y: 138,
			width: 15,
			height: 50,
			rotate: 20,
		},
		{
			id: "rightArm",
			name: "Right Arm",
			x: 128,
			y: 138,
			width: 15,
			height: 50,
			rotate: -20,
		},
		{ id: "leftHand", name: "Left Hand", cx: 52, cy: 204, r: 12 },
		{ id: "rightHand", name: "Right Hand", cx: 148, cy: 204, r: 12 },
		{
			id: "lowerBack",
			name: "Lower Back",
			x: 80,
			y: 180,
			width: 40,
			height: 30,
		},

		{ id: "leftCheek", name: "Left Cheek", cx: 85, cy: 220, r: 14 },
		{ id: "rightCheek", name: "Right Cheek", cx: 115, cy: 220, r: 14 },
		{
			id: "leftThigh",
			name: "Left Thigh",
			x: 75,
			y: 234,
			width: 20,
			height: 30,
		},
		{
			id: "rightThigh",
			name: "Right Thigh",
			x: 105,
			y: 234,
			width: 20,
			height: 30,
		},
		{ id: "leftKnee", name: "Left Knee", cx: 85, cy: 270, r: 10 },
		{ id: "rightKnee", name: "Right Knee", cx: 115, cy: 270, r: 10 },
		{ id: "leftShin", name: "Left Shin", x: 76, y: 280, width: 15, height: 26 },
		{
			id: "rightShin",
			name: "Right Shin",
			x: 108,
			y: 280,
			width: 15,
			height: 26,
		},
		{ id: "leftFoot", name: "Left Foot", x: 70, y: 306, width: 24, height: 15 },
		{
			id: "rightFoot",
			name: "Right Foot",
			x: 107,
			y: 306,
			width: 24,
			height: 15,
		},
	];

	const selectAudio = () => {
		const audio = new Audio(
			"/sound-effects/body-map&select-expressions/select.mp3",
		);
		audio.play().catch(() => {}); // Ignore errors if audio fails
	};

	const handlePartClick = (partId: string, view: "front" | "back"): void => {
		selectAudio();

		const setSelected =
			view === "front" ? setFrontSelectedParts : setBackSelectedParts;
		setSelected((prev) => {
			const current = prev[partId] || { pain: false, touch: false };
			const updated = {
				...prev,
				[partId]: {
					pain: mode === "pain" ? !current.pain : current.pain,
					touch: mode === "touch" ? !current.touch : current.touch,
				},
			};
			if (onSelectionChange) {
				if (view === "front") {
					onSelectionChange(updated, backSelectedParts);
				} else {
					onSelectionChange(frontSelectedParts, updated);
				}
			}
			return updated;
		});
		if (onBodyPartClick) onBodyPartClick(partId, view);
	};

	const clearAll = (): void => {
		setFrontSelectedParts({});
		setBackSelectedParts({});
		if (onSelectionChange) {
			onSelectionChange({}, {});
		}
	};

	const getPartFill = (partId: string, view: "front" | "back"): string => {
		const selection =
			view === "front" ? frontSelectedParts[partId] : backSelectedParts[partId];
		if (!selection || (!selection.pain && !selection.touch)) return "#fff";
		if (selection.pain && selection.touch) {
			return "url(#dualGradient)";
		}
		return selection.pain ? "#ff000050" : "#10b98150";
	};

	const getPartStroke = (partId: string, view: "front" | "back"): string => {
		const selection =
			view === "front" ? frontSelectedParts[partId] : backSelectedParts[partId];
		if (!selection || (!selection.pain && !selection.touch)) return "#94a3b8";
		if (selection.pain && selection.touch) {
			return "#374151";
		}
		return selection.pain ? "#dc2626" : "#059669";
	};

	const getPartOpacity = (
		partId: string,
		view: "front" | "back",
		isHovered: boolean = false,
	): number => {
		const selection =
			view === "front" ? frontSelectedParts[partId] : backSelectedParts[partId];
		if (selection && (selection.pain || selection.touch)) return 1; // Fully visible when selected
		return isHovered ? 0.5 : 0; // 50% opacity on hover, 0 otherwise
	};

	const getTransform = (part: BodyPart): string => {
		if (part.rotate === undefined) return "";
		if (part.cx && part.cy) {
			return `rotate(${part.rotate}, ${part.cx}, ${part.cy})`;
		}
		if (
			part.x !== undefined &&
			part.y !== undefined &&
			part.width !== undefined &&
			part.height !== undefined
		) {
			return `rotate(${part.rotate}, ${part.x + part.width / 2}, ${part.y + part.height / 2})`;
		}
		return "";
	};

	const frontImage =
		gender === "female"
			? "/body-map/girl-front.png"
			: "/body-map/boy-front.png";
	const backImage =
		gender === "female" ? "/body-map/girl-back.png" : "/body-map/boy-back.png";

	return (
		<div className="flex flex-row h-full border rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-50 via-white to-green-50">
			{/* Left: Body Map Area */}
			<div className="flex-1 flex flex-col items-center justify-center bg-white/80 p-8">
				<p className="text-gray-500 text-base">Tap a body part to select</p>
				<div className="flex flex-row gap-16 items-center justify-center">
					{/* Front View */}
					<div className="flex flex-col items-center">
						<div className="relative w-[280px] h-[360px] border-2 border-blue-200 rounded-xl bg-blue-50 shadow-md hover:shadow-lg transition-shadow duration-200">
							{/* Body map image as background */}
							<img
								src={frontImage}
								alt="Body Map Front"
								className="absolute top-0 left-0 w-full h-full object-contain select-none pointer-events-none"
								draggable={false}
							/>
							{/* Overlay SVG for interactive parts */}
							<svg
								width="200"
								height="360"
								viewBox="0 0 200 360"
								className="absolute top-0 left-0 w-full h-full"
								style={{ pointerEvents: "none" }}
							>
								<title>Front Body Map</title>
								<defs>
									<linearGradient
										id="dualGradient"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="0%"
									>
										<stop offset="50%" stopColor="#ff000050" />
										<stop offset="50%" stopColor="#10b98150" />
									</linearGradient>
								</defs>
								{frontBodyParts.map((part) => (
									<g key={part.id} style={{ pointerEvents: "auto" }}>
										{part.cx ? (
											<circle
												cx={part.cx}
												cy={part.cy}
												r={part.r}
												fill={getPartFill(part.id, "front")}
												stroke={getPartStroke(part.id, "front")}
												strokeWidth="2"
												opacity={getPartOpacity(
													part.id,
													"front",
													hoveredPart === part.id,
												)}
												transform={getTransform(part)}
												className="cursor-pointer transition-opacity duration-150"
												onMouseEnter={() => setHoveredPart(part.id)}
												onMouseLeave={() => setHoveredPart(null)}
												onClick={() => handlePartClick(part.id, "front")}
												role="button"
												tabIndex={0}
												aria-label={part.name || part.id}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ")
														handlePartClick(part.id, "front");
												}}
											/>
										) : (
											<rect
												x={part.x}
												y={part.y}
												width={part.width}
												height={part.height}
												rx="5"
												fill={getPartFill(part.id, "front")}
												stroke={getPartStroke(part.id, "front")}
												strokeWidth="2"
												opacity={getPartOpacity(
													part.id,
													"front",
													hoveredPart === part.id,
												)}
												transform={getTransform(part)}
												className="cursor-pointer transition-opacity duration-150"
												onMouseEnter={() => setHoveredPart(part.id)}
												onMouseLeave={() => setHoveredPart(null)}
												onClick={() => handlePartClick(part.id, "front")}
												role="button"
												tabIndex={0}
												aria-label={part.name || part.id}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ")
														handlePartClick(part.id, "front");
												}}
											/>
										)}
									</g>
								))}
							</svg>
						</div>
						<span className="mt-2 text-blue-700 font-semibold text-sm tracking-wide">
							Front
						</span>
					</div>
					{/* Back View */}
					<div className="flex flex-col items-center">
						<div className="relative w-[280px] h-[360px] border-2 border-blue-200 rounded-xl bg-blue-50 shadow-md hover:shadow-lg transition-shadow duration-200">
							<img
								src={backImage}
								alt="Body Map Back"
								className="absolute top-0 left-0 w-full h-full object-contain select-none pointer-events-none"
								draggable={false}
							/>
							<svg
								width="200"
								height="360"
								viewBox="0 0 200 360"
								className="absolute top-0 left-0 w-full h-full"
								style={{ pointerEvents: "none" }}
							>
								<title>Back Body Map</title>
								<defs>
									<linearGradient
										id="dualGradient"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="0%"
									>
										<stop offset="50%" stopColor="#ef4444" />
										<stop offset="50%" stopColor="#10b981" />
									</linearGradient>
								</defs>
								{backBodyParts.map((part) => (
									<g key={part.id} style={{ pointerEvents: "auto" }}>
										{part.cx ? (
											<circle
												cx={part.cx}
												cy={part.cy}
												r={part.r}
												fill={getPartFill(part.id, "back")}
												stroke={getPartStroke(part.id, "back")}
												strokeWidth="2"
												opacity={getPartOpacity(
													part.id,
													"back",
													hoveredPart === part.id,
												)}
												transform={getTransform(part)}
												className="cursor-pointer transition-opacity duration-150"
												onMouseEnter={() => setHoveredPart(part.id)}
												onMouseLeave={() => setHoveredPart(null)}
												onClick={() => handlePartClick(part.id, "back")}
												role="button"
												tabIndex={0}
												aria-label={part.name || part.id}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ")
														handlePartClick(part.id, "back");
												}}
											/>
										) : (
											<rect
												x={part.x}
												y={part.y}
												width={part.width}
												height={part.height}
												rx="5"
												fill={getPartFill(part.id, "back")}
												stroke={getPartStroke(part.id, "back")}
												strokeWidth="2"
												opacity={getPartOpacity(
													part.id,
													"back",
													hoveredPart === part.id,
												)}
												transform={getTransform(part)}
												className="cursor-pointer transition-opacity duration-150"
												onMouseEnter={() => setHoveredPart(part.id)}
												onMouseLeave={() => setHoveredPart(null)}
												onClick={() => handlePartClick(part.id, "back")}
												role="button"
												tabIndex={0}
												aria-label={part.name || part.id}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ")
														handlePartClick(part.id, "back");
												}}
											/>
										)}
									</g>
								))}
							</svg>
						</div>
						<span className="mt-2 text-blue-700 font-semibold text-sm tracking-wide">
							Back
						</span>
					</div>
				</div>
			</div>

			{/* Right: Controls and Output Panel */}
			<div className="w-[340px] flex flex-col border-l bg-gradient-to-b from-blue-100/60 via-white to-green-100/60">
				{/* Top: Mode Buttons and How to Use */}
				<div className="p-6 border-b flex flex-col gap-4">
					<div className="flex gap-3 mb-1 justify-end">
						<button
							type="button"
							onClick={() => setMode("pain")}
							className={`flex items-center gap-2 px-5 py-2 rounded-full border text-base font-semibold shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-300 ${mode === "pain" ? "bg-pink-500 text-white scale-105" : "bg-white text-gray-700 hover:bg-pink-100"}`}
						>
							<Icon icon="fluent-emoji:crying-face" className="w-5 h-5" />
							Hurt
						</button>
						<button
							type="button"
							onClick={() => setMode("touch")}
							className={`flex items-center gap-2 px-5 py-2 rounded-full border text-base font-semibold shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-300 ${mode === "touch" ? "bg-green-500 text-white scale-105" : "bg-white text-gray-700 hover:bg-green-100"}`}
						>
							<Icon icon="fluent-emoji:raised-hand" className="w-5 h-5" />
							Touch
						</button>
						<button
							type="button"
							onClick={clearAll}
							className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition-all duration-150 text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
							aria-label="Clear selections"
						>
							<RotateCcw size={20} className="mr-1" />
						</button>
					</div>
				</div>
				{/* Bottom: Output Area */}
				<div className="flex-1 p-6 flex flex-col">
					<div className="flex-1 flex items-center justify-center">
						<div className="w-full h-full bg-white/90 border border-gray-200 rounded-2xl shadow-inner flex flex-col items-center justify-start text-gray-700 text-base font-medium px-4 py-4 overflow-y-auto max-h-[350px]">
							{Object.values(frontSelectedParts).every(
								(sel) => !sel.pain && !sel.touch,
							) &&
							Object.values(backSelectedParts).every(
								(sel) => !sel.pain && !sel.touch,
							) ? (
								<div className="flex flex-col items-center justify-center h-full text-gray-400 text-lg">
									<Icon
										icon="fluent-emoji:thinking-face"
										className="w-8 h-8 mb-2"
									/>
									No body parts selected yet.
									{typeof onSelectionChange === "function" && (
										<button
											type="button"
											className="mt-6 px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-150 text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
											onClick={() => {
												onSelectionChange?.({}, {});
												onSkip?.();
											}}
										>
											Skip Body Map
										</button>
									)}
								</div>
							) : (
								<div className="w-full">
									{["Front", "Back"].map((view) => {
										const selectedParts =
											view === "Front" ? frontSelectedParts : backSelectedParts;
										const bodyParts =
											view === "Front" ? frontBodyParts : backBodyParts;
										const entries = Object.entries(selectedParts).filter(
											([_, sel]) => sel.pain || sel.touch,
										);
										if (entries.length === 0) return null;
										return (
											<div key={view} className="mb-4">
												<div className="font-bold text-blue-700 text-lg mb-2">
													{view}
												</div>
												<div className="flex flex-col gap-2">
													{entries.flatMap(([partId, sel]) => {
														const part = bodyParts.find((p) => p.id === partId);
														const chips = [];
														if (sel.pain)
															chips.push({
																type: "pain",
																color: "bg-red-100 text-red-800",
																icon: "fluent-emoji:crying-face",
																label: "Hurt",
															});
														if (sel.touch)
															chips.push({
																type: "touch",
																color: "bg-green-100 text-green-800",
																icon: "fluent-emoji:raised-hand",
																label: "Touch",
															});
														return chips.map((chip) => (
															<div
																key={partId + chip.type}
																className="flex items-center gap-2 text-base"
															>
																<span
																	className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${chip.color}`}
																>
																	<Icon icon={chip.icon} className="w-5 h-5" />
																	{chip.label}
																</span>
																<span className="ml-1 text-gray-700">
																	{part?.name}
																</span>
															</div>
														));
													})}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BodyMap;
