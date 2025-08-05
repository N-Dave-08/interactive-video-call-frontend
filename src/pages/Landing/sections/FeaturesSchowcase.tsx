import { Gamepad2, Palette, Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Container from "../Container";

const features = [
	{
		title: "Interactive Avatar Creator",
		description:
			"Create and customize avatars with hairstyles, clothes, and expressions.",
		icon: Palette,
		color: "from-blue-500 to-purple-600",
	},
	{
		title: "Emotional Expression Tools",
		description:
			"Body map and expression tools for effective emotional communication.",
		icon: Heart,
		color: "from-pink-500 to-rose-600",
	},
	{
		title: "Educational Mini-Games",
		description:
			"Engaging games like Flappy Bird, Snake, and Tetris for interactive learning.",
		icon: Gamepad2,
		color: "from-green-500 to-emerald-600",
	},
	{
		title: "Interactive Drawing Pad",
		description:
			"Creative drawing tools for artistic expression and art therapy.",
		icon: Sparkles,
		color: "from-orange-500 to-yellow-600",
	},
];

export default function FeaturesShowcase() {
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
						Interactive Features That Engage
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Our platform offers a complete suite of interactive tools designed
						to make video sessions engaging, educational, and fun for children
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
						>
							<div className="flex items-start gap-4 mb-6">
								<div
									className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}
								>
									<feature.icon className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</Container>
	);
}
