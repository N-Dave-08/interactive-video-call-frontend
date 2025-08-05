import { Gamepad2, Palette, Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Container from "../Container";

const features = [
	{
		title: "Interactive Avatar Creator",
		description:
			"Children can create and customize their own avatars with different hairstyles, clothes, and expressions. Make each session personal and engaging.",
		icon: Palette,
		color: "from-blue-500 to-purple-600",
		features: [
			"Customizable hairstyles and clothes",
			"Facial expressions and emotions",
			"Background selection",
			"Save favorite avatars",
		],
	},
	{
		title: "Emotional Expression Tools",
		description:
			"Body map and expression tools help children communicate their feelings effectively. Perfect for therapy and emotional development.",
		icon: Heart,
		color: "from-pink-500 to-rose-600",
		features: [
			"Interactive body map",
			"Emotion selection tools",
			"Feeling expression games",
			"Progress tracking",
		],
	},
	{
		title: "Educational Mini-Games",
		description:
			"Engaging games like Flappy Bird, Snake, and Tetris make learning fun and interactive. Keep children engaged during sessions.",
		icon: Gamepad2,
		color: "from-green-500 to-emerald-600",
		features: [
			"Multiple game options",
			"Skill development focus",
			"Progress monitoring",
			"Fun learning experience",
		],
	},
	{
		title: "Interactive Drawing Pad",
		description:
			"Creative drawing tools allow children to express themselves artistically. Perfect for art therapy and creative expression.",
		icon: Sparkles,
		color: "from-orange-500 to-yellow-600",
		features: [
			"Digital drawing canvas",
			"Multiple brush tools",
			"Color palette selection",
			"Save and share artwork",
		],
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

							<div className="space-y-3">
								{feature.features.map((item) => (
									<div key={item} className="flex items-center gap-3">
										<div
											className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`}
										/>
										<span className="text-gray-700 text-sm">{item}</span>
									</div>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</Container>
	);
}
