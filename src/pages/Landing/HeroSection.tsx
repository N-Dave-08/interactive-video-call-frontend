import motherBaby from "@/assets/mother-baby.svg";
import { Button } from "@/components/ui/button";
import Container from "./Container";

export default function HeroSection() {
	return (
		<Container index={0}>
			<div className="pt-[5.375rem]">
				<div className="flex items-center justify-between h-screen">
					<div className="flex items-center justify-between size-full pb-[5.375rem]">
						{/* Left Content Section */}
						<div className="flex flex-col justify-center">
							<div className="space-y-6">
								<p className="text-gray-600 text-sm font-medium">
									Get consultation
								</p>

								<h1 className="text-4xl font-bold text-gray-900 leading-tight">
									Schedule your <br /> consultation
								</h1>

								<Button>Login</Button>
							</div>
						</div>

						{/* Right Image Section */}
						<div className="w-1/2 flex items-center justify-center">
							<div className="relative h-full rounded-3xl p-8">
								<img
									src={motherBaby}
									alt="Mother holding baby - consultation services"
									className="w-full h-full object-cover"
								/>

								{/* Overlay Statistics Card */}
								<div className="absolute top-24 -left-24 bg-orange-400 text-white p-4 rounded-xl shadow-lg w-50 h-32">
									<div className="flex flex-col justify-center h-full mx-2">
										<div>
											<p className="text-lg font-bold">250,000+</p>
											<p className="text-2xl font-medium">Survivors</p>
											<p className="text-md opacity-90">help each other</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
