import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import motherBaby from "@/assets/pexels-liliana-drew-8506376.jpg";
import { Button } from "@/components/ui/button";
import Container from "../Container";

export default function HeroSection() {
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
	const [videoError, setVideoError] = useState(false);
	const [videoLoading, setVideoLoading] = useState(true);

	// Local video file path
	const videoPath = "/videos/demo-v-1.mp4";

	const openVideoModal = () => setIsVideoModalOpen(true);
	const closeVideoModal = () => setIsVideoModalOpen(false);

	const handleVideoError = () => {
		setVideoError(true);
		setVideoLoading(false);
	};

	const handleVideoLoad = () => {
		setVideoLoading(false);
		setVideoError(false);
	};

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
										Interactive Therapy
									</span>
									<br />
									<span className="text-gray-900">That Kids Actually Love</span>
								</h1>

								<p className="text-xl text-gray-600 leading-relaxed max-w-lg">
									Transform virtual therapy sessions with engaging games,
									interactive avatars, and creative tools. Make therapy fun and
									effective for children.
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
										alt="Interactive therapy session with games and avatars"
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
							<div className="relative w-full">
								{videoLoading && !videoError && (
									<div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
										<div className="text-center">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
											<p className="text-gray-600">Loading video...</p>
										</div>
									</div>
								)}

								{videoError ? (
									<div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
										<div className="text-center">
											<p className="text-red-600 mb-2">
												Video temporarily unavailable
											</p>
											<p className="text-gray-600 text-sm">
												Please try again later
											</p>
										</div>
									</div>
								) : (
									<video
										className={`w-full h-auto rounded-xl ${videoLoading ? "hidden" : ""}`}
										controls
										autoPlay
										muted
										title="Demo Video"
										onLoadedData={handleVideoLoad}
										onError={handleVideoError}
										preload="metadata"
									>
										<source src={videoPath} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								)}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
