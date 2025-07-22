import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Heart, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar as BirthdayCalendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useQuestionStore } from "@/store/questionStore";
import StageCardLayout from "./StageCardLayout";

interface ChildData {
	first_name: string;
	last_name: string;
	age: string;
	birthday: string;
}

export default function Stage1ChildData({
	value = {
		first_name: "Alex",
		last_name: "Johnson",
		age: "8",
		birthday: "06/15/2016",
	},
	onChange = () => {},
	onNext = () => {},
	loading = false,
	error = "",
}: {
	value?: ChildData;
	onChange?: (val: ChildData) => void;
	onNext?: () => void;
	onBack?: () => void;
	loading?: boolean;
	error?: string;
}) {
	const setQuestion = useQuestionStore((s) => s.setQuestion);
	const [currentStep, setCurrentStep] = useState(() => {
		const savedStep = localStorage.getItem("stage1-current-step");
		return savedStep ? Number(savedStep) : 0;
	});

	// Only show first and last name together in the first step
	const inputFields = [
		{
			id: "name",
			label: "What's your name?",
			placeholder: "Type your first and last name!",
			color: "from-pink-400 via-rose-400 to-red-400",
			bgColor: "from-pink-50 to-rose-50",
			iconify: "fluent-emoji:waving-hand",
			audio: "/ai-voiced/what-is-your-name.mp3",
		},
		{
			id: "age",
			label: "How old are you?",
			placeholder: "Your amazing age!",
			icon: Sparkles,
			color: "from-blue-400 via-cyan-400 to-teal-400",
			bgColor: "from-blue-50 to-cyan-50",
			type: "number",
			iconify: "fluent-emoji:balloon",
			audio: "/ai-voiced/tell-me-your-age.mp3",
		},
		{
			id: "birthday",
			label: "When is your special birthday?",
			placeholder: "Pick your birthday!",
			icon: Calendar,
			color: "from-green-400 via-emerald-400 to-teal-400",
			bgColor: "from-green-50 to-emerald-50",
			type: "date",
			iconify: "fluent-emoji:birthday-cake",
			audio: "/ai-voiced/when-is-your-bday.mp3",
		},
	];

	useEffect(() => {
		const audio = new Audio(inputFields[currentStep].audio);
		audio.play().catch(() => {}); // Ignore errors if audio fails

		return () => {
			audio.pause();
		};
	}, [currentStep]);

	useEffect(() => {
		localStorage.setItem("stage1-current-step", String(currentStep));
		setQuestion(inputFields[currentStep].label);
	}, [currentStep, setQuestion, inputFields[currentStep].label]);

	const currentField = inputFields[currentStep];
	const currentValue =
		currentStep === 0
			? value.first_name && value.last_name
				? value.first_name + " " + value.last_name
				: ""
			: value[currentField.id as keyof ChildData];
	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === inputFields.length - 1;

	const handleContinue = () => {
		if (isFirstStep) {
			if (!value.first_name || !value.last_name) return;
		}
		if (!isLastStep) {
			setCurrentStep((prev) => prev + 1);
		} else {
			localStorage.removeItem("stage1-current-step");
			onNext();
		}
	};

	// Floating decoration elements
	const FloatingElements = () => (
		<div className="absolute inset-0 pointer-events-none overflow-hidden">
			{[...Array(8)].map((_, i) => (
				<motion.div
					key={`floating-${inputFields[i % inputFields.length].iconify}-${i}`}
					className="absolute"
					initial={{
						x: Math.random() * 100 + "%",
						y: Math.random() * 100 + "%",
						rotate: 0,
						scale: 0.3 + Math.random() * 0.4,
					}}
					animate={{
						rotate: 360,
						y: [0, -30, 0],
						x: [0, Math.random() * 20 - 10, 0],
					}}
					transition={{
						rotate: {
							duration: 15 + i * 3,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
						},
						y: {
							duration: 4 + i,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						},
						x: {
							duration: 6 + i,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						},
					}}
				>
					{i % 3 === 0 ? (
						<Star className="w-4 h-4 text-yellow-300 fill-current" />
					) : i % 3 === 1 ? (
						<Heart className="w-4 h-4 text-pink-300 fill-current" />
					) : (
						<Sparkles className="w-4 h-4 text-purple-300" />
					)}
				</motion.div>
			))}
		</div>
	);

	const renderField = () => {
		if (currentStep === 0) {
			return (
				<div className="flex flex-col md:flex-row gap-6">
					<div className="relative flex-1">
						<div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl blur opacity-30" />
						<Input
							id="first_name"
							type="text"
							placeholder="Type your first name here!"
							value={value.first_name}
							onChange={(e) =>
								onChange({ ...value, first_name: e.target.value })
							}
							className="relative pl-6 pr-6 py-8 font-bold text-2xl border-3 border-gray-200 rounded-3xl bg-white/90 backdrop-blur-sm focus:border-purple-400 focus:ring-6 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300 shadow-lg"
						/>
					</div>
					<div className="relative flex-1">
						<div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-violet-50 rounded-3xl blur opacity-30" />
						<Input
							id="last_name"
							type="text"
							placeholder="Type your last name here!"
							value={value.last_name}
							onChange={(e) =>
								onChange({ ...value, last_name: e.target.value })
							}
							className="relative pl-6 pr-6 py-8 font-bold text-2xl border-3 border-gray-200 rounded-3xl bg-white/90 backdrop-blur-sm focus:border-purple-400 focus:ring-6 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300 shadow-lg"
						/>
					</div>
				</div>
			);
		}
		if (currentField.id === "birthday") {
			let selectedDate: Date | undefined;
			if (currentValue) {
				const parts = currentValue.split("/");
				if (parts.length === 3) {
					const [month, day, year] = parts;
					const date = new Date(
						`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
					);
					if (!Number.isNaN(date.getTime())) selectedDate = date;
				}
			}

			return (
				<div className="relative flex flex-col items-center">
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-3 border-green-200 shadow-xl">
						<BirthdayCalendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => {
								if (date) {
									const mm = String(date.getMonth() + 1).padStart(2, "0");
									const dd = String(date.getDate()).padStart(2, "0");
									const yyyy = date.getFullYear();
									onChange({ ...value, birthday: `${mm}/${dd}/${yyyy}` });
								}
							}}
							disabled={{ after: new Date() }}
							className="mx-auto"
						/>
					</div>
					{currentValue && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							className="mt-4 p-3 bg-green-100 rounded-2xl border-2 border-green-300"
						>
							<p className="text-green-700 font-bold text-center flex items-center justify-center gap-2">
								<Icon icon="mdi:check-circle" className="w-5 h-5" /> Selected:{" "}
								{currentValue}
							</p>
						</motion.div>
					)}
				</div>
			);
		}

		return (
			<div className="relative">
				<div
					className={`absolute inset-0 bg-gradient-to-r ${currentField.bgColor} rounded-3xl blur opacity-30`}
				/>
				<Input
					id={currentField.id}
					type={currentField.type || "text"}
					placeholder={currentField.placeholder}
					value={currentValue}
					onChange={(e) =>
						onChange({ ...value, [currentField.id]: e.target.value })
					}
					className="relative pl-20 pr-6 py-8 font-bold text-2xl border-3 border-gray-200 rounded-3xl bg-white/90 backdrop-blur-sm focus:border-purple-400 focus:ring-6 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300 shadow-lg"
					min={currentField.type === "number" ? "1" : undefined}
				/>
			</div>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 100, damping: 15 }}
		>
			<StageCardLayout cardClassName="max-w-2xl">
				<div className="relative">
					<FloatingElements />

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
						className="text-center mb-8"
					>
						<motion.div
							className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-full mb-6 shadow-xl"
							whileHover={{ scale: 1.1, rotate: 10 }}
							animate={{ y: [0, -5, 0] }}
							transition={{
								y: {
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								},
							}}
						>
							{currentStep === 0 ? (
								<Icon icon="fluent-emoji:waving-hand" className="w-14 h-14" />
							) : currentField.icon ? (
								<currentField.icon className="w-14 h-14 text-white" />
							) : null}
						</motion.div>
						<h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
							Tell me about yourself!{" "}
							<Icon icon="fluent-emoji:sparkles" className="inline w-8 h-8" />
						</h2>
						<p className="text-gray-600 text-xl font-semibold">
							Let's get to know each other better!
						</p>
					</motion.div>

					<div className="space-y-8 flex-1 flex flex-col justify-between">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentField.id}
								initial={{ opacity: 0, x: -50, scale: 0.8 }}
								animate={{ opacity: 1, x: 0, scale: 1 }}
								exit={{ opacity: 0, x: 50, scale: 0.8 }}
								transition={{
									type: "spring",
									stiffness: 120,
									damping: 18,
									duration: 0.6,
								}}
								className="group"
							>
								<div className="relative">
									<div
										className={`absolute inset-0 bg-gradient-to-r ${currentField.color} rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
									/>
									<div className="relative flex items-center">
										{currentStep !== 0 && (
											<motion.div
												className={`absolute left-6 z-10 w-12 h-12 bg-gradient-to-r ${currentField.color} rounded-full flex items-center justify-center shadow-lg`}
												initial={{ scale: 0, rotate: -180 }}
												animate={{ scale: 1, rotate: 0 }}
												transition={{
													type: "spring",
													stiffness: 200,
													damping: 10,
													delay: 0.4,
												}}
												whileHover={{ scale: 1.1, rotate: 10 }}
											>
												{currentField.icon ? (
													<currentField.icon className="w-6 h-6 text-white" />
												) : null}
											</motion.div>
										)}
										<div className="w-full">{renderField()}</div>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
						className="flex justify-center mt-8"
					>
						<motion.button
							type="button"
							onClick={handleContinue}
							disabled={
								loading ||
								(isFirstStep
									? !value.first_name || !value.last_name
									: !currentValue)
							}
							className="flex items-center px-10 py-5 text-xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-3 border-purple-300"
							whileTap={{ scale: 0.95 }}
							whileHover={{ y: -3 }}
						>
							{loading ? (
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										duration: 1,
										repeat: Number.POSITIVE_INFINITY,
										ease: "linear",
									}}
									className="w-8 h-8 border-3 border-white border-t-transparent rounded-full mr-3"
								/>
							) : (
								<Sparkles className="w-6 h-6 mr-3" />
							)}
							{loading ? (
								"Saving..."
							) : isLastStep ? (
								<>
									Let's Continue!{" "}
									<Icon
										icon="fluent-emoji:party-popper"
										className="ml-2 w-6 h-6"
									/>
								</>
							) : (
								<>
									Continue{" "}
									<Icon icon="fluent-emoji:sparkles" className="ml-2 w-6 h-6" />
								</>
							)}
						</motion.button>
					</motion.div>

					{error && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="mt-4 p-4 bg-red-100 border-3 border-red-300 rounded-2xl text-red-700 text-center font-bold"
						>
							{error}
						</motion.div>
					)}
				</div>
			</StageCardLayout>
		</motion.div>
	);
}
