import { Route, Routes } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
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
			<Route
				path="/client/*"
				element={
					<ClientLayout>
						<Routes>
							<Route path="home" element={<HomePage />} />
							<Route path="schedule" element={<Schedule />} />
							<Route path="mini-games" element={<MiniGames />} />
							<Route path="mini-games/snake" element={<Snake />} />
							<Route path="drawing-pad" element={<DrawingPad />} />
						</Routes>
					</ClientLayout>
				}
			/>
		</Routes>
	);
}
