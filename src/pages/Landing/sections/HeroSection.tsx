import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import motherBaby from "@/assets/mother-baby.svg";
import { Button } from "@/components/ui/button";
import Container from "../Container";

export default function HeroSection() {
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

	// Replace this with your actual YouTube video ID
	const youtubeVideoId = "bp3NgXouCMo"; // Example ID, replace with your demo video

	const openVideoModal = () => setIsVideoModalOpen(true);
	const closeVideoModal = () => setIsVideoModalOpen(false);

	return (
		<>
			<Container>
				<div className="pt-24 pb-12">
					<div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
						{/* Left Content Section */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className="space-y-8"
						>
							<div className="space-y-6">
								<h1 className="text-5xl lg:text-6xl font-bold leading-tight">
									<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
										Expert Care
									</span>
									<br />
									<span className="text-gray-900">When You Need It Most</span>
								</h1>

								<p className="text-xl text-gray-600 leading-relaxed max-w-lg">
									Connect with certified healthcare professionals for
									personalized consultations. Get the support and guidance you
									deserve, from pregnancy to parenthood.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									variant="outline"
									size="lg"
									onClick={openVideoModal}
									className="border-2 border-gray-200 hover:border-indigo-300 px-8 py-4 rounded-xl transition-all duration-300 bg-transparent hover:bg-indigo-50"
								>
									<Play className="w-5 h-5 mr-2" />
									Watch Demo
								</Button>
							</div>
						</motion.div>

						{/* Right Image Section */}
						<motion.div
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
							className="relative"
						>
							<div className="relative">
								{/* Main image container */}
								<div className="relative bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-3xl p-8 shadow-2xl">
									<img
										src={motherBaby || "/placeholder.svg"}
										alt="Mother holding baby - consultation services"
										className="w-full h-auto object-cover rounded-2xl"
									/>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</Container>

			{/* YouTube Video Modal */}
			<AnimatePresence>
				{isVideoModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={closeVideoModal}
					>
						<motion.div
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.5, opacity: 0 }}
							transition={{
								duration: 0.3,
								type: "spring",
								stiffness: 300,
								damping: 30,
							}}
							className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close Button */}
							<Button
								onClick={closeVideoModal}
								className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
							>
								<X className="w-6 h-6" />
							</Button>

							{/* Video Container */}
							<div
								className="relative w-full"
								style={{ paddingBottom: "56.25%" }}
							>
								<iframe
									className="absolute top-0 left-0 w-full h-full"
									src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
									title="Demo Video"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
