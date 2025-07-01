import { motion } from "motion/react";
import motherBaby from "@/assets/mother-baby.svg";
import { Button } from "@/components/ui/button";
import Container from "./Container";

export default function HeroSection() {
	return (
		<Container>
			<div className="pt-[5.375rem]">
				<div className="flex items-center justify-between h-screen">
					<div className="flex items-center justify-between size-full pb-[5.375rem]">
						{/* Left Content Section */}
						<motion.div
							initial={{ opacity: 0, x: -40 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className="flex flex-col justify-center ml-20"
						>
							<div className="space-y-6">
								<p className="text-gray-600 text-xl font-medium">
									Get consultation
								</p>

								<h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent  leading-tight">
									Schedule your consultation
								</h1>

								<Button>Login</Button>
							</div>
						</motion.div>

						{/* Right Image Section */}
						<motion.div
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className="w-1/2 flex items-center justify-center"
						>
							<div className="relative h-full rounded-3xl p-8">
								<img
									src={motherBaby}
									alt="Mother holding baby - consultation services"
									className="w-full h-full object-cover"
								/>

								{/* Overlay Statistics Card */}
								<motion.div
									initial={{ opacity: 0, y: 50, rotate: -5 }}
									animate={{ opacity: 1, y: 0, rotate: 0 }}
									transition={{
										duration: 0.8,
										ease: "easeOut",
										delay: 0.6,
										type: "spring",
										stiffness: 100,
									}}
									whileHover={{
										scale: 1.05,
										rotate: 1,
										transition: { duration: 0.2 },
									}}
									className="absolute top-24 -left-16 bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 rounded-2xl shadow-2xl w-56 h-36 border border-orange-300/2"
								>
									<div className="flex flex-col justify-center h-full mx-2">
										<div className="relative flex flex-col justify-center h-full">
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.6, delay: 0.8 }}
											>
												<motion.p
													className="text-2xl font-bold mb-1"
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													transition={{
														duration: 0.5,
														delay: 1,
														type: "spring",
														stiffness: 200,
													}}
												>
													250,000+
												</motion.p>
												<motion.p
													className="text-xl font-semibold mb-1"
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.5, delay: 1.1 }}
												>
													Survivors
												</motion.p>
												<motion.p
													className="text-sm opacity-90"
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.5, delay: 1.2 }}
												>
													help each other
												</motion.p>
											</motion.div>
										</div>
									</div>
								</motion.div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</Container>
	);
}
