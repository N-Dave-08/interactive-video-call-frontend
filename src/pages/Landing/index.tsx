import AccountCreationSection from "./AccountCreationSection";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import InfoSection from "./InfoSection";
import Navbar from "./Navbar";

export default function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<HeroSection />
			<InfoSection />
			<AccountCreationSection />
			<Footer />
		</div>
	);
}
