import { motion } from "framer-motion";
import { Calendar, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as BirthdayCalendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StageCardLayout from "./StageCardLayout";

interface ChildData {
	first_name: string;
	last_name: string;
	age: string;
	birthday: string;
}

export default function Stage1ChildData({
	value,
	onChange,
	onNext,
	loading,
	error,
}: {
	value: ChildData;
	onChange: (val: ChildData) => void;
	onNext: () => void;
	loading?: boolean;
	error?: string;
}) {
	const [currentStep, setCurrentStep] = useState(() => {
		const savedStep = localStorage.getItem("stage1-current-step");
		return savedStep ? Number(savedStep) : 0;
	});

	useEffect(() => {
		localStorage.setItem("stage1-current-step", String(currentStep));
	}, [currentStep]);

	const inputFields = [
		{
			id: "first_name",
			label: "What's your first name?",
			placeholder: "Enter your first name",
			icon: User,
			color: "from-pink-400 to-rose-400",
		},
		{
			id: "last_name",
			label: "What's your last name?",
			placeholder: "Enter your last name",
			icon: User,
			color: "from-purple-400 to-violet-400",
		},
		{
			id: "age",
			label: "How old are you?",
			placeholder: "Enter your age",
			icon: Sparkles,
			color: "from-blue-400 to-cyan-400",
			type: "number",
		},
		{
			id: "birthday",
			label: "When is your birthday?",
			placeholder: "MM/DD/YYYY",
			icon: Calendar,
			color: "from-green-400 to-emerald-400",
			type: "date",
		},
	];

	const currentField = inputFields[currentStep];
	const isLastStep = currentStep === inputFields.length - 1;
	const currentValue = value[currentField.id as keyof ChildData];

	const handleContinue = () => {
		if (!isLastStep) {
			setCurrentStep((prev) => prev + 1);
		} else {
			localStorage.removeItem("stage1-current-step");
			onNext();
		}
	};

	const renderField = () => {
		if (currentField.id === "birthday") {
			// Parse the value to a Date if possible
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
						className="mb-2"
					/>
					{currentValue && (
						<div className="text-sm text-gray-700 mt-1">
							Selected: {currentValue}
						</div>
					)}
				</div>
			);
		}
		// Default input for other fields
		return (
			<Input
				id={currentField.id}
				type={currentField.type || "text"}
				placeholder={currentField.placeholder}
				value={currentValue}
				onChange={(e) =>
					onChange({ ...value, [currentField.id]: e.target.value })
				}
				className="pl-14 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300"
				min={currentField.type === "number" ? "1" : undefined}
			/>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<StageCardLayout>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="text-center mb-4"
				>
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-4">
						<User className="w-8 h-8 text-white" />
					</div>
					<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
						Tell me about yourself!
					</h2>
					<p className="text-gray-600 text-lg">
						Let's get to know each other better
					</p>
				</motion.div>

				<div className="space-y-4 flex-1 flex flex-col justify-between">
					<motion.div
						key={currentField.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="group"
					>
						<Label
							htmlFor={currentField.id}
							className="text-base font-semibold text-gray-700 mb-2 block"
						>
							{currentField.label}
						</Label>
						<div className="relative">
							<div
								className={`absolute inset-0 bg-gradient-to-r ${currentField.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
							/>
							<div className="relative flex items-center">
								<div
									className={`absolute left-4 z-10 w-8 h-8 bg-gradient-to-r ${currentField.color} rounded-full flex items-center justify-center`}
								>
									<currentField.icon className="w-5 h-5 text-white" />
								</div>
								<div className="w-full">{renderField()}</div>
							</div>
						</div>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.5 }}
					className="flex justify-center mt-2"
				>
					<Button
						type="button"
						onClick={handleContinue}
						disabled={!currentValue || loading}
						className="px-6 py-2 text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
					>
						{loading ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{
									duration: 1,
									repeat: Number.POSITIVE_INFINITY,
									ease: "linear",
								}}
								className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
							/>
						) : (
							<Sparkles className="w-5 h-5 mr-2" />
						)}
						{loading
							? "Saving..."
							: isLastStep
								? "Let's Continue!"
								: "Continue"}
					</Button>
				</motion.div>

				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mt-2 p-2 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center text-xs"
					>
						{error}
					</motion.div>
				)}
			</StageCardLayout>
		</motion.div>
	);
}
