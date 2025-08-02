import AccountCreationSection from "./AccountCreationSection";
import BlurBackground from "./backgrounds/blur-background";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import InfoSection from "./InfoSection";
import Navbar from "./Navbar";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";

export default function LandingPage() {
	const sections = [
		<HeroSection key="hero" />,
		<StatsSection key="stats" />,
		<InfoSection key="info" />,
		<TestimonialsSection key="testimonials" />,
		<AccountCreationSection key="account" />,
		<Footer key="footer" />,
	];

	return (
		<div className="flex flex-col min-h-screen">
			<BlurBackground />
			CASPTONE VERSION TEST
			<Navbar />
			{sections.map((Section, idx) => (
				<div
					key={Section.key}
					className={
						idx % 2 === 1 ? "bg-gradient-to-br from-slate-50 to-blue-50/50" : ""
					}
				>
					{Section}
				</div>
			))}
		</div>
	);
}
