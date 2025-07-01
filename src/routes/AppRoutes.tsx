import { Route, Routes } from "react-router-dom";
import DrawingPad from "@/pages/Client/DrawingPad";
import HomePage from "@/pages/Client/HomePage";
import MiniGames from "@/pages/Client/mini-games";
import Snake from "@/pages/Client/mini-games/snake";
import Schedule from "@/pages/Client/Schedule";
import LandingPage from "@/pages/Landing";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/client/home" element={<HomePage />} />
			<Route path="/client/schedule" element={<Schedule />} />
			<Route path="/client/mini-games" element={<MiniGames />} />
			<Route path="/client/mini-games/snake" element={<Snake />} />
			<Route path="/client/drawing-pad" element={<DrawingPad />} />
		</Routes>
	);
}
