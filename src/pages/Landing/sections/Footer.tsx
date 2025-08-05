import { Copyright, HeartHandshake } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
				<div className="grid md:grid-cols-3 gap-8 mb-12">
					{/* Company Info */}
					<div className="md:col-span-2">
						<div className="flex items-center gap-3 mb-6">
							<HeartHandshake className="h-8 w-8 text-indigo-400" />
							<div>
								<span className="font-bold text-xl">Prep Play</span>
								<div className="text-sm text-gray-400">Consultancy</div>
							</div>
						</div>
						<p className="text-gray-300 leading-relaxed mb-6 max-w-md">
							Interactive video call platform designed to engage children during
							therapy sessions. Making virtual sessions fun and effective with
							games, avatars, and creative tools.
						</p>
					</div>

					{/* How It Works */}
					<div>
						<h4 className="font-bold text-lg mb-6">How It Works</h4>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
									1
								</div>
								<div>
									<div className="text-white font-medium">Create Account</div>
									<div className="text-gray-400 text-sm">
										Sign up and set up your profile
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
									2
								</div>
								<div>
									<div className="text-white font-medium">Schedule Session</div>
									<div className="text-gray-400 text-sm">
										Book with your preferred therapist
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
									3
								</div>
								<div>
									<div className="text-white font-medium">Join Session</div>
									<div className="text-gray-400 text-sm">
										Use interactive tools during call
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
									4
								</div>
								<div>
									<div className="text-white font-medium">Track Progress</div>
									<div className="text-gray-400 text-sm">
										Monitor development over time
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom section */}
				<div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2 text-gray-400">
						<Copyright className="w-4 h-4" />
						<span>
							&copy; {new Date().getFullYear()} Prep Play. All rights reserved.
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
