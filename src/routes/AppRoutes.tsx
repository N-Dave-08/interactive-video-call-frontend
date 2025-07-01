import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "@/pages/Client/HomePage";
import MiniGames from "@/pages/Client/MiniGames";
import LandingPage from "@/pages/Landing";

export default function AppRoutes() {
	const navigate = useNavigate();

	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/client/home" element={<HomePage />} />
			<Route path="/client/mini-games" element={<MiniGames />} />
		</Routes>
	);
}
