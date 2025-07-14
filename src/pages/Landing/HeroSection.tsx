import { ArrowRight, Calendar, Play, Shield, Star, Users } from "lucide-react";
import { motion } from "motion/react";
import motherBaby from "@/assets/mother-baby.svg";
import { Button } from "@/components/ui/button";
import Container from "./Container";

export default function HeroSection() {
	return (
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
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-indigo-200 rounded-full px-4 py-2"
							>
								<Star className="w-4 h-4 text-indigo-600 fill-current" />
								<span className="text-sm font-medium text-indigo-700">
									Trusted by 250,000+ families
								</span>
							</motion.div>

							<h1 className="text-5xl lg:text-6xl font-bold leading-tight">
								<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
									Expert Care
								</span>
								<br />
								<span className="text-gray-900">When You Need It Most</span>
							</h1>

							<p className="text-xl text-gray-600 leading-relaxed max-w-lg">
								Connect with certified healthcare professionals for personalized
								consultations. Get the support and guidance you deserve, from
								pregnancy to parenthood.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<Button
								size="lg"
								className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
							>
								Schedule Consultation
								<ArrowRight className="w-5 h-5 ml-2" />
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="border-2 border-gray-200 hover:border-indigo-300 px-8 py-4 rounded-xl transition-all duration-300 bg-transparent"
							>
								<Play className="w-5 h-5 mr-2" />
								Watch Demo
							</Button>
						</div>

						{/* Trust indicators */}
						<div className="flex items-center gap-8 pt-4">
							<div className="flex items-center gap-2">
								<Users className="w-5 h-5 text-indigo-600" />
								<span className="text-sm text-gray-600">24/7 Support</span>
							</div>
							<div className="flex items-center gap-2">
								<Calendar className="w-5 h-5 text-emerald-600" />
								<span className="text-sm text-gray-600">Same Day Booking</span>
							</div>
							<div className="flex items-center gap-2">
								<Shield className="w-5 h-5 text-purple-600" />
								<span className="text-sm text-gray-600">HIPAA Compliant</span>
							</div>
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

							{/* Floating stats card */}
							<motion.div
								initial={{ opacity: 0, y: 50, rotate: -5 }}
								animate={{ opacity: 1, y: 0, rotate: -2 }}
								transition={{
									duration: 0.8,
									ease: "easeOut",
									delay: 0.6,
									type: "spring",
									stiffness: 100,
								}}
								whileHover={{
									scale: 1.05,
									rotate: 0,
									transition: { duration: 0.2 },
								}}
								className="absolute -top-6 -left-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm"
							>
								<div className="text-center">
									<motion.div
										className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{
											duration: 0.5,
											delay: 1,
											type: "spring",
											stiffness: 200,
										}}
									>
										250,000+
									</motion.div>
									<div className="text-sm font-semibold text-gray-700">
										Families Helped
									</div>
									<div className="text-xs text-gray-500">This year alone</div>
								</div>
							</motion.div>

							{/* Floating rating card */}
							<motion.div
								initial={{ opacity: 0, y: 50, rotate: 5 }}
								animate={{ opacity: 1, y: 0, rotate: 3 }}
								transition={{
									duration: 0.8,
									ease: "easeOut",
									delay: 0.8,
								}}
								whileHover={{
									scale: 1.05,
									rotate: 0,
									transition: { duration: 0.2 },
								}}
								className="absolute -bottom-6 -right-8 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100"
							>
								<div className="flex items-center gap-2">
									<div className="flex">
										{[1, 2, 3, 4, 5].map((starId) => (
											<Star
												key={`star-${starId}`}
												className="w-4 h-4 text-yellow-400 fill-current"
											/>
										))}
									</div>
									<span className="text-sm font-semibold">4.9/5</span>
								</div>
								<div className="text-xs text-gray-500 mt-1">
									From 12,000+ reviews
								</div>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</Container>
	);
}
