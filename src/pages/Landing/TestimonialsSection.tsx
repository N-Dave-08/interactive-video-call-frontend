import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";
import Container from "./Container";

const testimonials = [
	{
		name: "Sarah Johnson",
		role: "New Mother",
		content:
			"The consultation service was a lifesaver during my pregnancy. The doctors were incredibly knowledgeable and made me feel confident about my journey to motherhood.",
		rating: 5,
		avatar: "/placeholder.svg?height=60&width=60",
	},
	{
		name: "Michael Chen",
		role: "Father of Two",
		content:
			"Having access to expert advice 24/7 gave us peace of mind. The support we received helped us navigate the challenges of early parenthood with confidence.",
		rating: 5,
		avatar: "/placeholder.svg?height=60&width=60",
	},
	{
		name: "Emily Rodriguez",
		role: "Expecting Mother",
		content:
			"The personalized care plan they created for me was exactly what I needed. Every question was answered with patience and expertise.",
		rating: 5,
		avatar: "/placeholder.svg?height=60&width=60",
	},
];

export default function TestimonialsSection() {
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
						What Our Families Say
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Real stories from real families who have experienced our care
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
						>
							<div className="flex items-center justify-between mb-6">
								<div className="flex">
									{[1, 2, 3, 4, 5]
										.slice(0, testimonial.rating)
										.map((starId) => (
											<Star
												key={`star-${starId}`}
												className="w-5 h-5 text-yellow-400 fill-current"
											/>
										))}
								</div>
								<Quote className="w-8 h-8 text-indigo-200" />
							</div>

							<p className="text-gray-600 mb-6 leading-relaxed">
								"{testimonial.content}"
							</p>

							<div className="flex items-center gap-4">
								<img
									src={testimonial.avatar || "/placeholder.svg"}
									alt={testimonial.name}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div>
									<div className="font-semibold text-gray-900">
										{testimonial.name}
									</div>
									<div className="text-sm text-gray-500">
										{testimonial.role}
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</Container>
	);
}
