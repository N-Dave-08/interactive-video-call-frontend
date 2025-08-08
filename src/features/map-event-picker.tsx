import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Clock,
	Cloud,
	MapPin,
	Star,
	Sun,
	CloudRain,
	Zap,
	Wind,
} from "lucide-react";
import { useMapEventStore } from "../store/mapEventStore";

export interface MapEvent {
	time: "morning" | "afternoon" | "evening" | "night";
	place: string | null;
	weather: "sunny" | "cloudy" | "rainy" | "windy" | "stormy" | "foggy";
}

interface MapEventPickerProps {
	value?: MapEvent;
	onChange?: (event: MapEvent) => void;
	onComplete?: (event: MapEvent) => void;
	markCompleteTrigger?: boolean;
}

export default function MapEventPicker({
	value,
	onChange,
	onComplete,
	markCompleteTrigger,
}: MapEventPickerProps) {
	const {
		selectedPlace,
		currentStep,
		time,
		weather,
		setSelectedPlace,
		setCurrentStep,
		setTime,
		setWeather,
	} = useMapEventStore();

	// Track if user is actively making changes to prevent auto-advancement
	const [isEditing, setIsEditing] = React.useState(false);

	// Update store state when value prop changes
	useEffect(() => {
		if (value) {
			setTime(value.time);
			setWeather(value.weather);
			if (value.place) {
				setSelectedPlace(value.place);
			}

			// Don't auto-advance if user is actively editing
			if (isEditing) {
				return;
			}

			// Only auto-advance to completion step if we're not currently in the middle of editing
			// This prevents jumping to completion when user clicks "Make Changes" and then selects something
			if (currentStep === 4) {
				// If we're already at completion step, stay there
				return;
			}

			// Determine current step based on completed data, but don't auto-advance to completion
			let step = 1;
			if (value.time) step = 2;
			if (value.weather) step = 3;
			if (value.place) step = 3; // Don't auto-advance to completion step
			setCurrentStep(step);
		}
	}, [
		value,
		setSelectedPlace,
		setTime,
		setWeather,
		setCurrentStep,
		currentStep,
		isEditing,
	]);

	const timeOptions = [
		{
			value: "morning" as const,
			label: "Morning",
			time: "7:00 - 12:00 PM",
			icon: Sun,
			color: "from-yellow-200 to-orange-200",
		},
		{
			value: "afternoon" as const,
			label: "Afternoon",
			time: "12:00 - 5:00 PM",
			icon: Sun,
			color: "from-orange-200 to-red-200",
		},
		{
			value: "evening" as const,
			label: "Evening",
			time: "5:00 - 8:00 PM",
			icon: Sun,
			color: "from-red-200 to-purple-200",
		},
		{
			value: "night" as const,
			label: "Night",
			time: "8:00 PM - 12:00 AM",
			icon: Clock,
			color: "from-purple-200 to-indigo-200",
		},
	];

	const weatherOptions = [
		{
			value: "sunny" as const,
			label: "Sunny",
			icon: Sun,
			color: "from-yellow-200 to-orange-200",
		},
		{
			value: "cloudy" as const,
			label: "Cloudy",
			icon: Cloud,
			color: "from-gray-200 to-blue-200",
		},
		{
			value: "rainy" as const,
			label: "Rainy",
			icon: CloudRain,
			color: "from-blue-200 to-gray-200",
		},
		{
			value: "windy" as const,
			label: "Windy",
			icon: Wind,
			color: "from-green-200 to-teal-200",
		},
		{
			value: "stormy" as const,
			label: "Stormy",
			icon: Zap,
			color: "from-purple-200 to-gray-200",
		},
		{
			value: "foggy" as const,
			label: "Foggy",
			icon: Cloud,
			color: "from-gray-300 to-gray-400",
		},
	];

	const placeOptions = [
		{ value: "school", label: "School", icon: "🏫" },
		{ value: "park", label: "Park", icon: "🌳" },
		{ value: "beach", label: "Beach", icon: "🏖️" },
		{ value: "home", label: "Home", icon: "🏠" },
		{ value: "restaurant", label: "Restaurant", icon: "🍽️" },
		{ value: "market", label: "Market", icon: "🛒" },
		{ value: "playground", label: "Playground", icon: "🎠" },
		{ value: "library", label: "Library", icon: "📚" },
		{ value: "cafe", label: "Cafe", icon: "☕" },
		{ value: "museum", label: "Museum", icon: "🏛️" },
		{ value: "cinema", label: "Cinema", icon: "🎬" },
		{ value: "outdoor", label: "Outdoor", icon: "🌲" },
	];

	const steps = [
		{ id: 1, label: "Time", icon: Clock, completed: currentStep > 1 },
		{ id: 2, label: "Weather", icon: Cloud, completed: currentStep > 2 },
		{ id: 3, label: "Place", icon: MapPin, completed: currentStep > 3 },
		{ id: 4, label: "All Done!", icon: Star, completed: currentStep > 4 },
	];

	const handleTimeSelect = (selectedTime: MapEvent["time"]) => {
		setTime(selectedTime);
		if (onChange) {
			onChange({ time: selectedTime, place: selectedPlace, weather });
		}
		setCurrentStep(2);
	};

	const handleWeatherSelect = (selectedWeather: MapEvent["weather"]) => {
		setWeather(selectedWeather);
		if (onChange) {
			onChange({ time, place: selectedPlace, weather: selectedWeather });
		}
		setCurrentStep(3);
	};

	const handlePlaceSelect = (selectedPlaceValue: string) => {
		setSelectedPlace(selectedPlaceValue);
		if (onChange) {
			onChange({ time, place: selectedPlaceValue, weather });
		}
		setIsEditing(false); // Reset editing flag when completing
		setCurrentStep(4);
	};

	const goBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	// Call onComplete when markCompleteTrigger changes to true
	useEffect(() => {
		if (markCompleteTrigger && onComplete && selectedPlace) {
			onComplete({ time, place: selectedPlace, weather });
		}
	}, [markCompleteTrigger, onComplete, time, selectedPlace, weather]);

	const renderTimeStep = () => (
		<div className="bg-white rounded-2xl p-6 shadow-lg">
			<div className="bg-gradient-to-r from-yellow-100 to-purple-100 rounded-xl p-6 mb-6">
				<div className="text-center">
					<Sun className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
					<h2 className="text-xl font-bold text-gray-800 mb-2">
						Can you tell me about when this happened?
					</h2>
					<p className="text-gray-600 text-sm">Let's mark the time together!</p>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-3 mb-6">
				{timeOptions.map((option) => (
					<motion.button
						key={option.value}
						onClick={() => handleTimeSelect(option.value)}
						className={`p-4 rounded-xl border-2 transition-all ${
							time === option.value
								? "border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 scale-105"
								: "border-gray-200 bg-white hover:border-purple-300 hover:scale-102"
						}`}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<div className="flex items-center gap-3">
							<option.icon className="w-6 h-6 text-gray-600" />
							<div className="text-left">
								<div className="font-semibold text-gray-800">
									{option.label}
								</div>
								<div className="text-xs text-gray-500">{option.time}</div>
							</div>
							{time === option.value && (
								<Star className="w-5 h-5 text-yellow-500 ml-auto" />
							)}
						</div>
					</motion.button>
				))}
			</div>
			{currentStep > 1 && (
				<div className="flex justify-start">
					<button
						type="button"
						onClick={goBack}
						className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						← Go Back
					</button>
				</div>
			)}
		</div>
	);

	const renderWeatherStep = () => (
		<div className="bg-white rounded-2xl p-6 shadow-lg">
			<div className="bg-gradient-to-r from-yellow-100 to-purple-100 rounded-xl p-6 mb-6">
				<div className="text-center">
					<Sun className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
					<h2 className="text-xl font-bold text-gray-800 mb-2">
						Do you remember what it was like outside that day?
					</h2>
					<p className="text-gray-600 text-sm">
						Was it sunny, rainy, or something else?
					</p>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-3 mb-6">
				{weatherOptions.map((option) => (
					<motion.button
						key={option.value}
						onClick={() => handleWeatherSelect(option.value)}
						className={`p-4 rounded-xl border-2 transition-all ${
							weather === option.value
								? "border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 scale-105"
								: "border-gray-200 bg-white hover:border-purple-300 hover:scale-102"
						}`}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<div className="text-center">
							<option.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
							<div className="font-semibold text-gray-800">{option.label}</div>
						</div>
					</motion.button>
				))}
			</div>
			{currentStep > 1 && (
				<div className="flex justify-start">
					<button
						type="button"
						onClick={goBack}
						className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						← Go Back
					</button>
				</div>
			)}
		</div>
	);

	const renderPlaceStep = () => (
		<div className="bg-white rounded-2xl p-6 shadow-lg">
			<div className="bg-gradient-to-r from-yellow-100 to-purple-100 rounded-xl p-6 mb-6">
				<div className="text-center">
					<MapPin className="w-12 h-12 mx-auto mb-4 text-purple-600" />
					<h2 className="text-xl font-bold text-gray-800 mb-2">
						Can you show me where you were?
					</h2>
					<p className="text-gray-600 text-sm">
						It's okay if you're not sure - we can figure it out together!
					</p>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-3 mb-6">
				{placeOptions.map((option) => (
					<motion.button
						key={option.value}
						onClick={() => handlePlaceSelect(option.value)}
						className={`p-4 rounded-xl border-2 transition-all ${
							selectedPlace === option.value
								? "border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 scale-105"
								: "border-gray-200 bg-white hover:border-purple-300 hover:scale-102"
						}`}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<div className="text-center">
							<div className="text-2xl mb-2">{option.icon}</div>
							<div className="font-semibold text-gray-800">{option.label}</div>
						</div>
					</motion.button>
				))}
			</div>
			{currentStep > 1 && (
				<div className="flex justify-start">
					<button
						type="button"
						onClick={goBack}
						className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						← Go Back
					</button>
				</div>
			)}
		</div>
	);

	const renderCompletionStep = () => (
		<div className="bg-white rounded-2xl p-6 shadow-lg">
			<div className="bg-gradient-to-r from-yellow-100 to-purple-100 rounded-xl p-6 mb-6">
				<div className="text-center">
					<Star className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
					<h2 className="text-xl font-bold text-gray-800 mb-2">
						You've done such a great job sharing with me!
					</h2>
					<p className="text-gray-600 text-sm">
						Thank you for helping me understand.
					</p>
				</div>
			</div>

			<div className="space-y-4 mb-6">
				<div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
					<Clock className="w-5 h-5 text-purple-600" />
					<span className="font-medium text-gray-800">Time:</span>
					<span className="px-3 py-1 bg-purple-200 rounded-full text-sm font-medium">
						{time.charAt(0).toUpperCase() + time.slice(1)}
					</span>
				</div>
				<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
					<Cloud className="w-5 h-5 text-blue-600" />
					<span className="font-medium text-gray-800">Weather:</span>
					<span className="px-3 py-1 bg-blue-200 rounded-full text-sm font-medium">
						{weather.charAt(0).toUpperCase() + weather.slice(1)}
					</span>
				</div>
				<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
					<MapPin className="w-5 h-5 text-green-600" />
					<span className="font-medium text-gray-800">Place:</span>
					<span className="px-3 py-1 bg-green-200 rounded-full text-sm font-medium">
						{placeOptions.find((p) => p.value === selectedPlace)?.label ||
							"Not selected"}
					</span>
				</div>
			</div>

			<div className="flex justify-center">
				<button
					type="button"
					onClick={() => {
						setIsEditing(true);
						setCurrentStep(1);
					}}
					className="px-8 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
				>
					Make Changes
				</button>
			</div>
		</div>
	);

	return (
		<div className="max-w-2xl mx-auto p-6">
			{/* Header */}
			<div className="text-center mb-8">
				{/* Progress Steps */}
				<div className="flex justify-center gap-4 mb-6">
					{steps.map((step) => (
						<div
							key={step.id}
							className={`flex flex-col items-center gap-2 ${
								step.completed
									? "text-green-600"
									: currentStep === step.id
										? "text-purple-600"
										: "text-gray-400"
							}`}
						>
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
									step.completed
										? "bg-green-100 border-green-500"
										: currentStep === step.id
											? "bg-purple-100 border-purple-500"
											: "bg-gray-100 border-gray-300"
								}`}
							>
								{step.completed ? (
									<Star className="w-5 h-5" />
								) : (
									<step.icon className="w-5 h-5" />
								)}
							</div>
							<span className="text-xs font-medium">{step.label}</span>
						</div>
					))}
				</div>
			</div>

			{/* Main Content */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentStep}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.3 }}
				>
					{currentStep === 1 && renderTimeStep()}
					{currentStep === 2 && renderWeatherStep()}
					{currentStep === 3 && renderPlaceStep()}
					{currentStep === 4 && renderCompletionStep()}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
