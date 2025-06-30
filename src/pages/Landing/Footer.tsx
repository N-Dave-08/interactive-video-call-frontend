import { Copyright, Mail, Phone } from "lucide-react";
import prepPlayLogo from "@/assets/logo.svg";

export default function Footer() {
	return (
		<footer className="bg-primary text-white px-6 md:px-10 pt-10 pb-2 w-full">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-6 justify-between">
				{/* Left: Logo and description */}
				<div className="flex-1 min-w-[220px] flex flex-col items-start">
					<div className="flex items-center gap-3 mb-3">
						<img
							src={prepPlayLogo}
							alt="Logo"
							className="h-10 w-10 rounded bg-white p-1 shadow"
						/>
						<span className="font-extrabold text-lg tracking-wide">
							Prep Play
						</span>
					</div>
					<p className="text-sm text-white/80 leading-relaxed mb-4 max-w-xs">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam
					</p>
				</div>
				{/* Center: Pages */}
				<div className="flex-1 min-w-[180px] flex flex-col items-start">
					<h4 className="font-bold mb-3 text-base">Pages</h4>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="/"
								className="hover:underline hover:text-accent transition-colors flex items-center gap-2"
							>
								<span>How it works</span>
							</a>
						</li>
						<li>
							<a
								href="/"
								className="hover:underline hover:text-accent transition-colors flex items-center gap-2"
							>
								<span>About</span>
							</a>
						</li>
						<li>
							<a
								href="/"
								className="hover:underline hover:text-accent transition-colors flex items-center gap-2"
							>
								<span>Privacy Policy</span>
							</a>
						</li>
					</ul>
				</div>
				{/* Right: Contact */}
				<div className="flex-1 min-w-[220px] flex flex-col items-start">
					<div className="bg-white/10 border border-white/10 rounded-lg p-4 w-full">
						<h4 className="font-bold mb-3 text-base">Contact Us!</h4>
						<ul className="space-y-3 text-sm">
							<li className="flex items-center gap-2">
								<Phone className="size-4" />
								<span>123 - 123 - 123</span>
							</li>
							<li className="flex items-center gap-2">
								<Mail className="size-4" />
								<span>example@gmail.com</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{/* Bottom copyright */}
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 text-xs text-white/70 pt-6 border-t border-white/15 mt-8">
				<span className="mb-1 md:mb-0">
					&copy; {new Date().getFullYear()} Pre-Play. All rights reserved.
				</span>
				<div className="flex items-center gap-1">
					<Copyright className="size-3" />
					<span>Copyright</span>
				</div>
			</div>
		</footer>
	);
}
