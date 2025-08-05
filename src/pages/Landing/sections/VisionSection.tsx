import { Heart, Target } from "lucide-react";
import { motion } from "motion/react";
import motherTeachingDaughter from "@/assets/mother-teaching-daughter.svg";
import thinkingMan from "@/assets/thinking-man.svg";
import Container from "../Container";

const visionItems = [
	{
		title: "Our Mission",
		description:
			"To equip social workers with an innovative, trauma-informed digital tool that facilitates sensitive interviews, empowers child victims, and supports their healing",
		icon: Heart,
		image: thinkingMan,
	},
	{
		title: "Our Vision",
		description:
			"A future where every child feels safe, heard, and empowered to heal through compassionate, innovative digital support.",
		icon: Target,
		image: motherTeachingDaughter,
	},
];

export default function VisionSection() {
	return (
		<Container>
			<div className="py-20">
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
							</div>

							{/* Image */}
							<div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
								<div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 group max-w-sm mx-auto">
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
