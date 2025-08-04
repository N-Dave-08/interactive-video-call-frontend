import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Sunset, Moon, CloudRain, Zap, Wind } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMapEventStore } from "../store/mapEventStore";

// Rain Component
const RainDrop = ({
	delay,
	duration,
	left,
}: {
	delay: number;
	duration: number;
	left: string;
}) => (
	<motion.div
		className="absolute w-0.5 bg-blue-700 opacity-60"
		style={{
			left,
			top: "-10px",
			width: "2px",
			height: "20px",
		}}
		animate={{
			y: ["0vh", "110vh"],
		}}
		transition={{
			duration,
			repeat: Number.POSITIVE_INFINITY,
			delay,
			ease: "linear",
		}}
	/>
);

const RainOverlay = () => {
	const rainDrops = Array.from({ length: 100 }, (_, i) => ({
		id: i,
		delay: Math.random() * 2,
		duration: 0.5 + Math.random() * 0.5,
		left: `${Math.random() * 100}%`,
	}));

	return (
		<div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
			{rainDrops.map((drop) => (
				<RainDrop
					key={drop.id}
					delay={drop.delay}
					duration={drop.duration}
					left={drop.left}
				/>
			))}
		</div>
	);
};

// Thunderstorm Component
const Lightning = ({ delay }: { delay: number }) => (
	<motion.div
		className="absolute inset-0 bg-white pointer-events-none"
		initial={{ opacity: 0 }}
		animate={{
			opacity: [0, 0.8, 0, 0.6, 0],
		}}
		transition={{
			duration: 0.3,
			repeat: Number.POSITIVE_INFINITY,
			repeatDelay: 3 + Math.random() * 4,
			delay,
		}}
	/>
);

const ThunderstormOverlay = () => {
	const lightningFlashes = Array.from({ length: 3 }, (_, i) => ({
		id: i,
		delay: Math.random() * 2,
	}));

	return (
		<div className="absolute inset-0 pointer-events-none z-40">
			{/* Dark storm clouds overlay */}
			<div className="absolute inset-0 bg-gray-900 opacity-30" />
			{/* Lightning flashes */}
			{lightningFlashes.map((flash) => (
				<Lightning key={flash.id} delay={flash.delay} />
			))}
			{/* Heavy rain */}
			<RainOverlay />
		</div>
	);
};

// Windy Component with waving lines
const WindyOverlay = () => {
	const windLines = Array.from({ length: 15 }, (_, i) => ({
		id: i,
		delay: Math.random() * 4,
		duration: 3 + Math.random() * 2,
		startY: `${Math.random() * 80 + 10}%`,
		size: Math.random() * 0.5 + 0.8, // Random size between 0.8 and 1.3
	}));

	return (
		<div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
			{windLines.map((line) => (
				<motion.div
					key={line.id}
					className="absolute text-gray-700 opacity-60 select-none"
					style={{
						left: "-10%",
						top: line.startY,
						fontSize: `${line.size}rem`,
						filter: "blur(0.5px)",
					}}
					animate={{
						x: ["0vw", "110vw"],
						y: [0, Math.sin(line.id) * 30],
					}}
					transition={{
						duration: line.duration,
						repeat: Number.POSITIVE_INFINITY,
						delay: line.delay,
						ease: "linear",
					}}
				>
					༄˖°.🍃.ೃ࿔*:･
				</motion.div>
			))}

			{/* Additional smaller wind lines for depth */}
			{Array.from({ length: 10 }, (_, i) => (
				<motion.div
					key={`small-${i}-${Math.random()}`}
					className="absolute text-gray-300 opacity-40 select-none"
					style={{
						left: "-5%",
						top: `${Math.random() * 90 + 5}%`,
						fontSize: "0.6rem",
						filter: "blur(1px)",
					}}
					animate={{
						x: ["0vw", "105vw"],
						rotate: [0, 10, -10, 0],
					}}
					transition={{
						duration: 4 + Math.random() * 3,
						repeat: Number.POSITIVE_INFINITY,
						delay: Math.random() * 3,
						ease: "easeInOut",
					}}
				>
					༄༄༄
				</motion.div>
			))}
		</div>
	);
};

export interface MapEvent {
	time: "morning" | "afternoon" | "evening";
	place: string | null;
	weather: "clear" | "rain" | "thunderstorm" | "windy";
}

interface MapEventPickerProps {
	value?: MapEvent;
	onChange?: (event: MapEvent) => void;
}

export default function MapEventPicker({
	value,
	onChange,
}: MapEventPickerProps) {
	// Always use internal state for time and weather
	const [time, setTime] = useState<MapEvent["time"]>("morning");
	const [weather, setWeather] = useState<MapEvent["weather"]>("clear");
	const timeAudioRef = useRef<HTMLAudioElement | null>(null);
	const weatherAudioRef = useRef<HTMLAudioElement | null>(null);
	const { selectedPlace, setSelectedPlace } = useMapEventStore();

	// Update internal state when value prop changes
	useEffect(() => {
		if (value) {
			setTime(value.time);
			setWeather(value.weather);
			if (value.place) {
				setSelectedPlace(value.place);
			}
		}
	}, [value, setSelectedPlace]);

	// Initialize with default values if no value is provided or if value has empty time/weather
	useEffect(() => {
		if (onChange && (!value || !value.time || !value.weather)) {
			onChange({
				time: value?.time || "morning",
				place: value?.place || null,
				weather: value?.weather || "clear",
			});
		}
	}, [value, onChange]);

	// Handlers: call onChange if controlled, otherwise update internal state
	const handleLocationClick = (locationId: string) => {
		setSelectedPlace(locationId);
		selectSound();
		if (onChange) {
			onChange({
				time,
				place: locationId,
				weather,
			});
		}
	};

	const handleTimeChange = (newTime: "morning" | "afternoon" | "evening") => {
		selectSound();
		setTime(newTime);
		if (onChange) {
			onChange({
				time: newTime,
				place: selectedPlace,
				weather,
			});
		}
	};

	const handleWeatherChange = (
		newWeather: "clear" | "rain" | "thunderstorm" | "windy",
	) => {
		selectSound();
		setWeather(newWeather);
		if (onChange) {
			onChange({
				time,
				place: selectedPlace,
				weather: newWeather,
			});
		}
	};

	const timeOptions = [
		{
			value: "morning",
			label: "Morning",
			icon: Sun,
			color: "bg-gradient-to-r from-yellow-200 to-orange-200",
			activeColor: "bg-gradient-to-r from-yellow-300 to-orange-300",
			textColor: "text-orange-800",
			shadow: "shadow-yellow-200",
			sound: "/event/sounds/time/morning-ambience.mp3",
		},
		{
			value: "afternoon",
			label: "Afternoon",
			icon: Sunset,
			color: "bg-gradient-to-r from-orange-200 to-red-200",
			activeColor: "bg-gradient-to-r from-orange-300 to-red-300",
			textColor: "text-red-800",
			shadow: "shadow-orange-200",
			sound: "/event/sounds/time/afternoon-ambience.mp3",
		},
		{
			value: "evening",
			label: "Evening",
			icon: Moon,
			color: "bg-gradient-to-r from-purple-200 to-indigo-200",
			activeColor: "bg-gradient-to-r from-purple-300 to-indigo-300",
			textColor: "text-indigo-800",
			shadow: "shadow-purple-200",
			sound: "/event/sounds/time/night-ambience.mp3",
		},
	] as const;

	const weatherOptions = [
		{
			value: "clear",
			label: "Clear",
			icon: Sun,
			color: "bg-gradient-to-r from-blue-200 to-cyan-200",
			activeColor: "bg-gradient-to-r from-blue-300 to-cyan-300",
			textColor: "text-blue-800",
			sound: null,
		},
		{
			value: "rain",
			label: "Rain",
			icon: CloudRain,
			color: "bg-gradient-to-r from-gray-200 to-blue-200",
			activeColor: "bg-gradient-to-r from-gray-300 to-blue-300",
			textColor: "text-blue-800",
			sound: "/event/sounds/weather/raindrops.mp3",
		},
		{
			value: "thunderstorm",
			label: "Storm",
			icon: Zap,
			color: "bg-gradient-to-r from-gray-300 to-purple-200",
			activeColor: "bg-gradient-to-r from-gray-400 to-purple-300",
			textColor: "text-purple-800",
			sound: "/event/sounds/weather/thunderstorm.mp3",
		},
		{
			value: "windy",
			label: "Windy",
			icon: Wind,
			color: "bg-gradient-to-r from-green-200 to-teal-200",
			activeColor: "bg-gradient-to-r from-green-300 to-teal-300",
			textColor: "text-teal-800",
			sound: "/event/sounds/weather/windy.mp3",
		},
	] as const;

	const locations = [
		{
			id: "lake",
			name: "Lake",
			image: `/event/${time}/lake.png`,
			hitbox: { top: "35%", left: "2%", width: "80px", height: "80px" },
		},
		{
			id: "hospital",
			name: "Hospital",
			image: `/event/${time}/hospital.png`,
			hitbox: { top: "38%", left: "55%", width: "100px", height: "100px" },
		},
		{
			id: "school",
			name: "School",
			image: `/event/${time}/school.png`,
			hitbox: { top: "10%", left: "31%", width: "110px", height: "110px" },
		},
		{
			id: "barn",
			name: "Barn",
			image: `/event/${time}/barn.png`,
			hitbox: { top: "62%", left: "78%", width: "140px", height: "90px" },
		},
		{
			id: "forest",
			name: "Forest",
			image: `/event/${time}/forest.png`,
			hitbox: { top: "20%", left: "80%", width: "150px", height: "90px" },
		},
		{
			id: "house1",
			name: "House 1",
			image: `/event/${time}/house_1.png`,
			hitbox: { top: "22%", left: "14%", width: "80px", height: "80px" },
		},
		{
			id: "house2",
			name: "House 2",
			image: `/event/${time}/house_2.png`,
			hitbox: { top: "42%", left: "17%", width: "80px", height: "80px" },
		},
		{
			id: "river",
			name: "River",
			image: `/event/${time}/river.png`,
			hitbox: { top: "38%", left: "70%", width: "110px", height: "60px" },
		},
		{
			id: "mountain",
			name: "Mountains",
			image: `/event/${time}/mountains.png`,
			hitbox: { top: "18%", left: "52%", width: "160px", height: "80px" },
		},
		{
			id: "park",
			name: "Park",
			image: `/event/${time}/park.png`,
			hitbox: { top: "62%", left: "42%", width: "170px", height: "90px" },
		},
		{
			id: "playground",
			name: "Playground",
			image: `/event/${time}/playground.png`,
			hitbox: { top: "62%", left: "16%", width: "80px", height: "80px" },
		},
		{
			id: "road",
			name: "Road",
			image: `/event/${time}/road.png`,
			hitbox: { top: "50%", left: "78%", width: "150px", height: "60px" },
		},
		{
			id: "shop",
			name: "Shop",
			image: `/event/${time}/shop.png`,
			hitbox: { top: "35%", left: "36%", width: "90px", height: "80px" },
		},
	];

	const selectSound = () => {
		const audio = new Audio("/event/sounds/select.mp3");
		audio.play().catch(() => {}); // Ignore errors if audio fails
	};

	// Handle time audio changes
	useEffect(() => {
		if (timeAudioRef.current) {
			timeAudioRef.current.pause();
			timeAudioRef.current.currentTime = 0;
		}
		const selectedTime = timeOptions.find((option) => option.value === time);
		if (selectedTime?.sound) {
			const audio = new Audio(selectedTime.sound);
			audio.loop = true;
			audio.volume = 0.3;
			audio.play().catch((e) => console.log("Audio play failed:", e));
			timeAudioRef.current = audio;
		}
		return () => {
			if (timeAudioRef.current) {
				timeAudioRef.current.pause();
				timeAudioRef.current.currentTime = 0;
			}
		};
	}, [time, timeOptions]);

	// Handle weather audio changes
	useEffect(() => {
		if (weatherAudioRef.current) {
			weatherAudioRef.current.pause();
			weatherAudioRef.current.currentTime = 0;
		}
		const selectedWeather = weatherOptions.find(
			(option) => option.value === weather,
		);
		if (selectedWeather?.sound) {
			const audio = new Audio(selectedWeather.sound);
			audio.loop = true;
			audio.volume = 0.4;
			audio.play().catch((e) => console.log("Audio play failed:", e));
			weatherAudioRef.current = audio;
		}
		return () => {
			if (weatherAudioRef.current) {
				weatherAudioRef.current.pause();
				weatherAudioRef.current.currentTime = 0;
			}
		};
	}, [weather, weatherOptions]);

	// For rendering, use value if controlled, otherwise use internal state
	const renderTime = time || "morning";
	const renderPlace = selectedPlace;
	const renderWeather = weather || "clear";

	const selectedLocationData = locations.find((loc) => loc.id === renderPlace);

	return (
		<TooltipProvider>
			<div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen relative overflow-hidden">
				{/* Floating elements */}
				<div
					className="absolute top-4 left-8 text-4xl animate-bounce"
					style={{ animationDelay: "0.2s" }}
				>
					✨
				</div>
				<div
					className="absolute top-12 right-10 text-4xl animate-bounce"
					style={{ animationDelay: "0.7s" }}
				>
					☁️
				</div>

				{/* Header */}
				<div className="text-center mb-8 relative z-10">
					<motion.h1
						className="text-4xl font-black text-purple-800 drop-shadow-sm mb-2"
						animate={{
							textShadow: [
								"2px 2px 0px #ec4899",
								"2px 2px 0px #8b5cf6",
								"2px 2px 0px #06b6d4",
								"2px 2px 0px #ec4899",
							],
						}}
						transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
					>
						🗺️ Adventure Map! 🎮
					</motion.h1>
					<p className="text-lg font-bold text-purple-700 bg-white/50 px-6 py-3 rounded-full border-2 border-purple-200 inline-flex items-center gap-2 shadow-md">
						{selectedLocationData ? (
							<>
								<motion.span
									animate={{ scale: [1, 1.2, 1] }}
									transition={{
										duration: 0.5,
										repeat: Number.POSITIVE_INFINITY,
									}}
								>
									🎯
								</motion.span>{" "}
								Selected: {selectedLocationData.name}!
							</>
						) : (
							"👆 Pick a place!"
						)}
					</p>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
					{/* Left Controls Panel */}
					<div className="lg:col-span-1 space-y-6">
						{/* Time Controls */}
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-white">
							<h3 className="text-lg font-black text-purple-800 mb-4 text-center flex items-center justify-center gap-2">
								<span>🕐</span> Time of Day
							</h3>
							<div className="space-y-3">
								{timeOptions.map((option) => {
									const IconComponent = option.icon;
									return (
										<motion.button
											key={option.value}
											onClick={() => handleTimeChange(option.value)}
											className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-3 font-bold text-sm transition-all transform ${
												renderTime === option.value
													? `${option.activeColor} ${option.textColor} border-white scale-105 ${option.shadow} shadow-lg`
													: `${option.color} ${option.textColor} border-white hover:scale-102 ${option.shadow} shadow-md`
											}`}
											whileHover={{
												scale: renderTime === option.value ? 1.08 : 1.05,
												x: 5,
											}}
											whileTap={{ scale: 0.98 }}
										>
											<IconComponent className="w-6 h-6 flex-shrink-0" />
											<span className="font-black">{option.label}</span>
											{renderTime === option.value && (
												<motion.div
													className="ml-auto text-yellow-400 text-lg"
													animate={{ rotate: 360 }}
													transition={{
														duration: 2,
														repeat: Number.POSITIVE_INFINITY,
													}}
												>
													⭐
												</motion.div>
											)}
										</motion.button>
									);
								})}
							</div>
						</div>

						{/* Weather Controls */}
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-white">
							<h3 className="text-lg font-black text-purple-800 mb-4 text-center flex items-center justify-center gap-2">
								<span>🌤️</span> Weather
							</h3>
							<div className="space-y-3">
								{weatherOptions.map((option) => {
									const IconComponent = option.icon;
									return (
										<motion.button
											key={option.value}
											onClick={() => handleWeatherChange(option.value)}
											className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-3 font-bold text-sm transition-all transform ${
												renderWeather === option.value
													? `${option.activeColor} ${option.textColor} border-white scale-105 shadow-lg`
													: `${option.color} ${option.textColor} border-white hover:scale-102 shadow-md`
											}`}
											whileHover={{
												scale: renderWeather === option.value ? 1.08 : 1.05,
												x: 5,
											}}
											whileTap={{ scale: 0.98 }}
										>
											<IconComponent className="w-6 h-6 flex-shrink-0" />
											<span className="font-black">{option.label}</span>
											{renderWeather === option.value && (
												<motion.div
													className="ml-auto text-yellow-400 text-lg"
													animate={{ rotate: 360 }}
													transition={{
														duration: 2,
														repeat: Number.POSITIVE_INFINITY,
													}}
												>
													⭐
												</motion.div>
											)}
										</motion.button>
									);
								})}
							</div>
						</div>

						{/* Instructions */}
						<div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-200 shadow-lg">
							<h4 className="font-black text-purple-800 mb-2 text-center">
								🎮 How to Play
							</h4>
							<ul className="text-sm text-purple-700 space-y-1">
								<li>• Choose time & weather</li>
								<li>• Click locations on map</li>
								<li>• Explore different combos!</li>
							</ul>
						</div>
					</div>

					{/* Map Container */}
					<div className="lg:col-span-3">
						<div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white">
							<div className="relative w-full">
								<motion.img
									key={renderTime}
									src={`/event/${renderTime}/map.png`}
									className="w-full h-auto block"
									alt={`${renderTime} map background`}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5 }}
								/>

								{/* Weather Overlays - positioned above map but below tooltips */}
								<AnimatePresence>
									{renderWeather === "rain" && (
										<motion.div
											key="rain-overlay"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.5 }}
										>
											<RainOverlay />
										</motion.div>
									)}
									{renderWeather === "thunderstorm" && (
										<motion.div
											key="thunderstorm-overlay"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.5 }}
										>
											<ThunderstormOverlay />
										</motion.div>
									)}
									{renderWeather === "windy" && (
										<motion.div
											key="windy-overlay"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.5 }}
										>
											<WindyOverlay />
										</motion.div>
									)}
								</AnimatePresence>

								{/* Selected Location Overlay */}
								<AnimatePresence>
									{renderPlace && (
										<motion.div
											key={`${renderPlace}-${renderTime}`}
											className="absolute inset-0 z-20"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.3 }}
										>
											<motion.img
												src={selectedLocationData?.image}
												className={`w-full h-auto block ${renderTime === "morning" ? "drop-shadow-[5px_0_10px_brown]" : renderTime === "afternoon" ? "drop-shadow-[5px_0_10px_white]" : "drop-shadow-[5px_0_10px_orange]"}`}
												animate={{ y: [0, -0.8, 0.8, -0.5, 0.5, 0] }}
												transition={{
													duration: 1.8,
													repeat: Number.POSITIVE_INFINITY,
													ease: "easeInOut",
												}}
											/>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Interactive Location Hitboxes - highest z-index for interaction */}
								{locations.map((location) => (
									<Tooltip key={location.id}>
										<TooltipTrigger asChild>
											<motion.div
												style={{
													...location.hitbox,
													borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
													transition:
														"background-color 0.2s ease-in-out, border-radius 0.3s ease-in-out",
												}}
												onClick={() => handleLocationClick(location.id)}
												className={`absolute z-50 cursor-pointer bg-transparent hover:bg-white/20`}
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 0.1 }}
											></motion.div>
										</TooltipTrigger>
										<TooltipContent>
											<p>{location.name}</p>
										</TooltipContent>
									</Tooltip>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Status Display */}
				<AnimatePresence>
					{selectedLocationData && (
						<motion.div
							initial={{ opacity: 0, y: 50, scale: 0.8 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 50, scale: 0.8 }}
							transition={{ type: "spring", stiffness: 200, damping: 20 }}
							className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50
                       bg-gradient-to-r from-green-300 to-blue-300 text-blue-900
                       px-6 py-3 rounded-full shadow-xl border-4 border-white
                       font-black text-lg whitespace-nowrap flex items-center gap-2"
						>
							<motion.span
								animate={{ rotate: [0, 10, -10, 0] }}
								transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
							>
								✨
							</motion.span>
							Time:{" "}
							{(renderTime || "morning").charAt(0).toUpperCase() +
								(renderTime || "morning").slice(1)}
							, Location: {selectedLocationData.name}, Weather:{" "}
							{(renderWeather || "clear").charAt(0).toUpperCase() +
								(renderWeather || "clear").slice(1)}
							<motion.span
								animate={{ rotate: [0, -10, 10, 0] }}
								transition={{
									duration: 1,
									repeat: Number.POSITIVE_INFINITY,
									delay: 0.5,
								}}
							>
								✨
							</motion.span>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Add the button below the map */}
				<div className="flex justify-center mt-6">
					{/* Submit button removed: changes are now submitted automatically */}
				</div>
			</div>
		</TooltipProvider>
	);
}
