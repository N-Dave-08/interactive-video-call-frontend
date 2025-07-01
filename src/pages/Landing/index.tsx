import AccountCreationSection from "./AccountCreationSection";
import BlurBackground from "./backgrounds/blur-background";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import InfoSection from "./InfoSection";
import Navbar from "./Navbar";

export default function LandingPage() {
	const sections = [
		<HeroSection key="hero" />,
		<InfoSection key="info" />,
		<AccountCreationSection key="account" />,
		<Footer key="footer" />,
	];

	return (
		<div className="flex flex-col">
			<BlurBackground />
			<Navbar />
			{sections.map((Section, idx) => (
				<div
					key={Section.key}
					className={
						idx % 2 === 1
							? "bg-linear-to-tr/oklch  from-indigo-500 to-emerald-500"
							: ""
					}
				>
					{Section}
				</div>
			))}
		</div>
	);
}
