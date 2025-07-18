import {
	Copyright,
	Facebook,
	HeartHandshake,
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	Phone,
	Twitter,
} from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
				<div className="grid md:grid-cols-4 gap-8 mb-12">
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
							Providing expert healthcare consultations and support for families
							worldwide. Your trusted partner in maternal and child health.
						</p>
						<div className="flex gap-4">
							<a
								href="/"
								className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
							>
								<Facebook className="w-5 h-5" />
							</a>
							<a
								href="/"
								className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="/"
								className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
							>
								<Instagram className="w-5 h-5" />
							</a>
							<a
								href="/"
								className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
							>
								<Linkedin className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-bold text-lg mb-6">Quick Links</h4>
						<ul className="space-y-3">
							<li>
								<a
									href="/"
									className="text-gray-300 hover:text-white transition-colors"
								>
									How it works
								</a>
							</li>
							<li>
								<a
									href="/"
									className="text-gray-300 hover:text-white transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="/"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Services
								</a>
							</li>
							<li>
								<a
									href="/"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="/"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Privacy Policy
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className="font-bold text-lg mb-6">Contact Us</h4>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<Phone className="w-5 h-5 text-indigo-400" />
								<span className="text-gray-300">+1 (555) 123-4567</span>
							</div>
							<div className="flex items-center gap-3">
								<Mail className="w-5 h-5 text-indigo-400" />
								<span className="text-gray-300">hello@prepplay.com</span>
							</div>
							<div className="flex items-start gap-3">
								<MapPin className="w-5 h-5 text-indigo-400 mt-1" />
								<span className="text-gray-300">
									123 Healthcare Ave
									<br />
									Medical District, NY 10001
								</span>
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
					<div className="flex gap-6 text-sm text-gray-400">
						<a href="/" className="hover:text-white transition-colors">
							Terms of Service
						</a>
						<a href="/" className="hover:text-white transition-colors">
							Privacy Policy
						</a>
						<a href="/" className="hover:text-white transition-colors">
							Cookie Policy
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
