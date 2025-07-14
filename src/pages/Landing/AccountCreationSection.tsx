import { ArrowRight, Clock, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Container from "./Container";

export default function AccountCreationSection() {
	return (
		<Container>
			<div className="py-20">
				<div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 rounded-3xl p-12 text-white relative overflow-hidden">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] opacity-10"></div>

					<div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -40 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							className="space-y-6"
						>
							<h2 className="text-4xl font-bold leading-tight">
								Ready to Start Your Journey?
							</h2>
							<p className="text-xl text-white/90 leading-relaxed">
								Join thousands of families who trust us with their healthcare
								needs. Get started today with a free consultation.
							</p>

							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Shield className="w-5 h-5 text-emerald-300" />
									<span className="text-white/90">
										HIPAA compliant and secure
									</span>
								</div>
								<div className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-emerald-300" />
									<span className="text-white/90">24/7 support available</span>
								</div>
								<div className="flex items-center gap-3">
									<Users className="w-5 h-5 text-emerald-300" />
									<span className="text-white/90">
										Expert healthcare professionals
									</span>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 40 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							viewport={{ once: true }}
							className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
						>
							<div className="space-y-6">
								<div>
									<h3 className="text-2xl font-bold mb-2">Get Started Today</h3>
									<p className="text-white/80">
										Create your account and schedule your first consultation
									</p>
								</div>

								<div className="space-y-4">
									<Input
										type="email"
										placeholder="Enter your email address"
										className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
									/>
									<Input
										type="text"
										placeholder="Full name"
										className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
									/>
									<Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-semibold py-3 rounded-xl transition-all duration-300">
										Start Free Consultation
										<ArrowRight className="w-5 h-5 ml-2" />
									</Button>
								</div>

								<p className="text-sm text-white/70 text-center">
									No credit card required. Cancel anytime.
								</p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</Container>
	);
}
