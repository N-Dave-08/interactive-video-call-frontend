import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import motherTeachingDaughter from "@/assets/mother-teaching-daughter.svg";
import thinkingMan from "@/assets/thinking-man.svg";
import { Button } from "@/components/ui/button";
import Container from "./Container";

const features = [
	{
		title: "Expert Consultations",
		description:
			"Connect with board-certified healthcare professionals who specialize in maternal and child health. Get personalized advice tailored to your unique situation.",
		image: thinkingMan,
		benefits: [
			"Board-certified professionals",
			"Personalized care plans",
			"Evidence-based guidance",
			"Flexible scheduling",
		],
	},
	{
		title: "Family Support Programs",
		description:
			"Comprehensive support programs designed to guide you through every stage of your journey. From pregnancy to early childhood development.",
		image: motherTeachingDaughter,
		benefits: [
			"Pregnancy support",
			"Parenting guidance",
			"Child development tracking",
			"Family wellness plans",
		],
	},
];

export default function InfoSection() {
	return (
		<Container>
			<div className="py-20">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Comprehensive Care Solutions
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Our platform offers a complete suite of healthcare services designed
						to support you and your family at every step
					</p>
				</motion.div>

				<div className="space-y-24">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 60 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: index * 0.2 }}
							viewport={{ once: true }}
							className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
						>
							{/* Content */}
							<div
								className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
							>
								<div>
									<h3 className="text-3xl font-bold text-gray-900 mb-4">
										{feature.title}
									</h3>
									<p className="text-lg text-gray-600 leading-relaxed">
										{feature.description}
									</p>
								</div>

								<div className="space-y-3">
									{feature.benefits.map((benefit) => (
										<div key={benefit} className="flex items-center gap-3">
											<CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
											<span className="text-gray-700">{benefit}</span>
										</div>
									))}
								</div>

								<Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
									Learn More
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</div>

							{/* Image */}
							<div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
								<div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group">
									<img
										src={feature.image || "/placeholder.svg"}
										alt={feature.title}
										className="w-full h-auto object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
									/>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</Container>
	);
}
