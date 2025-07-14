import { motion } from "framer-motion";
import { ArrowLeft, FileText, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Stage6SessionNotesTags({
	notes,
	tagsInput,
	onNotesChange,
	onTagsInputChange,
	onTagsBlur,
	onNext,
	onBack,
	loading,
	error,
}: {
	notes: string;
	tagsInput: string;
	onNotesChange: (val: string) => void;
	onTagsInputChange: (val: string) => void;
	onTagsBlur: () => void;
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	const suggestedTags = [
		{ label: "Fun", emoji: "🎉", color: "from-yellow-400 to-orange-400" },
		{ label: "Learning", emoji: "📚", color: "from-blue-400 to-cyan-400" },
		{ label: "Creative", emoji: "🎨", color: "from-purple-400 to-pink-400" },
		{ label: "Happy", emoji: "😊", color: "from-green-400 to-emerald-400" },
		{ label: "Challenge", emoji: "🏆", color: "from-red-400 to-pink-400" },
		{ label: "Progress", emoji: "⭐", color: "from-indigo-400 to-purple-400" },
	];

	const addSuggestedTag = (tag: string) => {
		const currentTags = tagsInput
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);
		if (!currentTags.includes(tag)) {
			const newTags = [...currentTags, tag].join(", ");
			onTagsInputChange(newTags);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
				<CardContent className="p-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="text-center mb-8"
					>
						<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mb-4">
							<FileText className="w-8 h-8 text-white" />
						</div>
						<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
							Session Summary
						</h2>
						<p className="text-gray-600 text-lg">
							Tell us about your experience today!
						</p>
					</motion.div>

					<div className="space-y-8">
						{/* Session Notes */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
						>
							<Label
								htmlFor="session_notes"
								className="text-xl font-semibold text-gray-700 mb-4 flex items-center"
							>
								<FileText className="w-6 h-6 mr-2 text-indigo-500" />
								How was your session today?
							</Label>
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-20" />
								<Textarea
									id="session_notes"
									placeholder="Tell us what you enjoyed, what you learned, or how you're feeling..."
									value={notes}
									onChange={(e) => onNotesChange(e.target.value)}
									className="relative min-h-[120px] p-4 text-lg border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-indigo-300 resize-none"
									rows={4}
								/>
							</div>
						</motion.div>

						{/* Tags Section */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
						>
							<Label
								htmlFor="tags"
								className="text-xl font-semibold text-gray-700 mb-4 flex items-center"
							>
								<Tag className="w-6 h-6 mr-2 text-purple-500" />
								Add some fun tags!
							</Label>

							{/* Suggested Tags */}
							<div className="mb-4">
								<p className="text-sm text-gray-600 mb-3">Quick picks:</p>
								<div className="flex flex-wrap gap-2">
									{suggestedTags.map((tag, index) => (
										<motion.button
											key={tag.label}
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => addSuggestedTag(tag.label)}
											className={`px-4 py-2 rounded-full border-2 border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25 transition-all duration-300 flex items-center space-x-2`}
										>
											<span>{tag.emoji}</span>
											<span className="text-sm font-medium text-gray-700">
												{tag.label}
											</span>
										</motion.button>
									))}
								</div>
							</div>

							{/* Tags Input */}
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-20" />
								<div className="relative flex items-center">
									<div className="absolute left-4 z-10 w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
										<Tag className="w-5 h-5 text-white" />
									</div>
									<Input
										id="tags"
										placeholder="e.g. fun, creative, happy (separate with commas)"
										value={tagsInput}
										onChange={(e) => onTagsInputChange(e.target.value)}
										onBlur={onTagsBlur}
										className="pl-16 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300"
									/>
								</div>
							</div>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.5 }}
						className="flex justify-between items-center mt-8"
					>
						<Button
							type="button"
							variant="outline"
							onClick={onBack}
							className="px-6 py-3 text-lg font-semibold border-2 border-gray-300 text-gray-600 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-transparent"
						>
							<ArrowLeft className="w-5 h-5 mr-2" />
							Back
						</Button>

						<Button
							type="button"
							onClick={onNext}
							disabled={!notes || !tagsInput || loading}
							className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
							{loading ? "Saving..." : "Finish Session!"}
						</Button>
					</motion.div>

					{error && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="mt-4 p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 text-center"
						>
							{error}
						</motion.div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}
