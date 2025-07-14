import { Award, Clock, Heart, Users } from "lucide-react";
import { motion } from "motion/react";
import Container from "./Container";

const stats = [
	{
		icon: Users,
		number: "250,000+",
		label: "Families Served",
		description: "Trusted by families worldwide",
	},
	{
		icon: Clock,
		number: "24/7",
		label: "Available Support",
		description: "Round-the-clock care",
	},
	{
		icon: Award,
		number: "98%",
		label: "Satisfaction Rate",
		description: "Highly rated by our users",
	},
	{
		icon: Heart,
		number: "15+",
		label: "Years Experience",
		description: "Proven track record",
	},
];

export default function StatsSection() {
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
						Trusted by Families Everywhere
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Our commitment to excellence has made us the preferred choice for
						healthcare consultations
					</p>
				</motion.div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="text-center group"
						>
							<div className="bg-gradient-to-br from-indigo-50 to-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
								<stat.icon className="w-8 h-8 text-indigo-600" />
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-2">
								{stat.number}
							</div>
							<div className="text-lg font-semibold text-gray-700 mb-1">
								{stat.label}
							</div>
							<div className="text-sm text-gray-500">{stat.description}</div>
						</motion.div>
					))}
				</div>
			</div>
		</Container>
	);
}
