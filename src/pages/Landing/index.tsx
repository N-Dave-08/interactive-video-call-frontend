import InteractiveTherapySection from "./sections/CallToActionSection";
import BlurBackground from "./backgrounds/blur-background";
import Footer from "./sections/Footer";
import HeroSection from "./sections/HeroSection";
import VisionSection from "./sections/VisionSection";
import Navbar from "./Navbar";
import PlatformBenefitsSection from "./sections/PlatformBenefitsSection";
import FeaturesShowcase from "./sections/FeaturesSchowcase";

export default function LandingPage() {
	const sections = [
		<HeroSection key="hero" />,
		<PlatformBenefitsSection key="benefits" />,
		<VisionSection key="vision" />,
		<FeaturesShowcase key="features" />,
		<InteractiveTherapySection key="interactive-therapy" />,
		<Footer key="footer" />,
	];

	return (
		<div className="flex flex-col min-h-screen">
			<BlurBackground />
			<Navbar />
			{sections.map((Section, idx) => (
				<div
					key={Section.key}
					id={
						Section.key === "benefits"
							? "benefits"
							: Section.key === "features"
								? "features"
								: Section.key === "vision"
									? "vision"
									: undefined
					}
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
