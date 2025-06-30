import prepPlayLogo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";

export default function Navbar() {
	const navLinks = [
		{ label: "How it works", href: "/" },
		{ label: "About", href: "/" },
		{ label: "Privacy Policy", href: "/" },
	];

	return (
		<nav className="fixed top-0 w-full flex justify-between items-center px-10 py-5 bg-white/30 backdrop-blur-md shadow-md mb-[-5.375rem] z-50">
			<div className="flex items-center gap-20">
				<div className="flex items-center">
					<img src={prepPlayLogo} alt="logo" />
					<div className="leading-0">
						<p className="font-bold text-lg">Prep Play</p>
						<span className="text-sm">Consultancy</span>
					</div>
				</div>
				<ul className="flex items-center gap-14">
					{navLinks.map((link) => (
						<li key={link.label}>
							<a href={link.href}>{link.label}</a>
						</li>
					))}
				</ul>
			</div>
			<Button>Login</Button>
		</nav>
	);
}
