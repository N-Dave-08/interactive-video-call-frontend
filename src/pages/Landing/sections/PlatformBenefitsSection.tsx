import { Users, Shield, DollarSign, Accessibility } from "lucide-react";
import { motion } from "motion/react";
import Container from "../Container";

const benefits = [
	{
		icon: Users,
		title: "Engaging for Children",
		description:
			"Interactive tools keep kids focused and interested during sessions",
		color: "from-blue-500 to-purple-600",
	},
	{
		icon: Shield,
		title: "Easy for Social Workers",
		description:
			"Simple interface designed for professionals to use during video calls",
		color: "from-green-500 to-emerald-600",
	},
	{
		icon: DollarSign,
		title: "Cost-Effective",
		description: "No expensive equipment or software licenses required",
		color: "from-orange-500 to-yellow-600",
	},
	{
		icon: Accessibility,
		title: "Accessible",
		description:
			"Designed to work for children with different needs and abilities",
		color: "from-pink-500 to-rose-600",
	},
];

export default function PlatformBenefitsSection() {
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
						Why Choose Our Platform?
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Our interactive video call platform is designed to make virtual
						therapy more effective, engaging, and accessible for everyone
						involved.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{benefits.map((benefit, index) => (
						<motion.div
							key={benefit.title}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group relative overflow-hidden"
						>
							<div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl" />
							<div className="text-center">
								<div
									className={`p-3 rounded-xl bg-gradient-to-r ${benefit.color} group-hover:scale-110 transition-transform duration-300 w-12 h-12 flex items-center justify-center mx-auto mb-4`}
								>
									<benefit.icon className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-2">
									{benefit.title}
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed mb-3">
									{benefit.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</Container>
	);
}
