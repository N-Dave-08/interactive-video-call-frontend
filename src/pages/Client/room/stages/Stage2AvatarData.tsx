import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarCreator from "@/features/avatar-creator";
import StageCardLayout from "./StageCardLayout";

interface AvatarData {
	head: string;
	hair: string;
	expression: string;
	clothes: string;
	background: string;
}

export default function Stage2AvatarData({
	value,
	onChange,
	onNext,
	onBack,
	loading,
	error,
}: {
	value: AvatarData;
	onChange: (val: AvatarData) => void;
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	const handleAvatarChange = (data: AvatarData) => {
		onChange(data);
	};

	return (
		<StageCardLayout>
			<AvatarCreator
				selectedHead={value.head}
				selectedHair={value.hair}
				selectedExpression={value.expression}
				selectedClothes={value.clothes}
				selectedBackground={value.background}
				onChange={handleAvatarChange}
			/>
			<div className="sticky bottom-0 w-full z-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="flex justify-between items-center mt-8"
				>
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						className="px-6 py-3 text-base font-semibold border-2 border-gray-300 text-gray-600 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-transparent"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Back
					</Button>

					<Button
						type="button"
						onClick={onNext}
						disabled={loading}
						className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
							<ArrowRight className="w-5 h-5 mr-2" />
						)}
						{loading ? "Saving..." : "Next Step!"}
					</Button>
				</motion.div>
				{error && <div className="text-red-500 text-center mt-2">{error}</div>}
			</div>
		</StageCardLayout>
	);
}
