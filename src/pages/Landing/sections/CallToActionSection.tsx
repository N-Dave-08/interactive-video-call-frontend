import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Container from "../Container";
import { Link } from "react-router-dom";

export default function CallToActionSection() {
	return (
		<Container>
			<div className="py-20">
				<div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 rounded-3xl p-12 text-white relative overflow-hidden">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] opacity-10"></div>

					<div className="relative z-10 text-center">
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							className="space-y-8 mb-12"
						>
							<h2 className="text-4xl font-bold leading-tight">
								Ready to Experience Interactive Therapy?
							</h2>
							<p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
								Transform your virtual sessions with engaging tools that keep
								children focused and make therapy more effective than ever
								before.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							viewport={{ once: true }}
							className="flex flex-col sm:flex-row gap-4 justify-center"
						>
							<Button
								className="bg-white text-indigo-600 hover:bg-white/90 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg"
								asChild
							>
								<Link to="/register">
									Join Platform
									<ArrowRight className="w-5 h-5 ml-2" />
								</Link>
							</Button>
						</motion.div>
					</div>
				</div>
			</div>
		</Container>
	);
}
