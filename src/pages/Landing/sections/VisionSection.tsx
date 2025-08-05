import { Heart, Target, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import motherTeachingDaughter from "@/assets/mother-teaching-daughter.svg";
import thinkingMan from "@/assets/thinking-man.svg";
import Container from "../Container";

const visionItems = [
	{
		title: "Our Mission",
		description:
			"To revolutionize virtual therapy by making it engaging, accessible, and effective for children. We believe every child deserves access to interactive tools that make therapy sessions fun and meaningful.",
		icon: Heart,
		image: thinkingMan,
		benefits: [
			"Making therapy engaging for children",
			"Breaking down barriers to access",
			"Supporting social workers and therapists",
			"Creating meaningful connections",
		],
	},
	{
		title: "Our Vision",
		description:
			"To become the leading platform that bridges the gap between traditional therapy and modern technology, ensuring that distance is never a barrier to quality care and support for children and families.",
		icon: Target,
		image: motherTeachingDaughter,
		benefits: [
			"Universal access to quality care",
			"Technology that serves humanity",
			"Innovation in child therapy",
			"Building stronger communities",
		],
	},
];

export default function VisionSection() {
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
						Our Vision & Purpose
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						We're on a mission to transform how children experience therapy and
						support, making virtual sessions as engaging and effective as
						in-person interactions.
					</p>
				</motion.div>

				<div className="space-y-24">
					{visionItems.map((item, index) => (
						<motion.div
							key={item.title}
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
								<div className="flex items-center gap-4 mb-6">
									<div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
										<item.icon className="w-8 h-8 text-white" />
									</div>
									<h3 className="text-3xl font-bold text-gray-900">
										{item.title}
									</h3>
								</div>

								<p className="text-lg text-gray-600 leading-relaxed">
									{item.description}
								</p>

								<div className="space-y-3">
									{item.benefits.map((benefit) => (
										<div key={benefit} className="flex items-center gap-3">
											<Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0" />
											<span className="text-gray-700">{benefit}</span>
										</div>
									))}
								</div>
							</div>

							{/* Image */}
							<div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
								<div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group">
									<img
										src={item.image || "/placeholder.svg"}
										alt={item.title}
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
