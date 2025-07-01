import { Route, Routes, useNavigate } from "react-router-dom";
import DrawingPad from "@/pages/Client/DrawingPad";
import HomePage from "@/pages/Client/HomePage";
import MiniGames from "@/pages/Client/MiniGames";
import Schedule from "@/pages/Client/Schedule";
import LandingPage from "@/pages/Landing";

export default function AppRoutes() {
	const navigate = useNavigate();

	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/client/home" element={<HomePage />} />
			<Route path="/client/schedule" element={<Schedule />} />
			<Route path="/client/mini-games" element={<MiniGames />} />
			<Route path="/client/drawing-pad" element={<DrawingPad />} />
		</Routes>
	);
}
