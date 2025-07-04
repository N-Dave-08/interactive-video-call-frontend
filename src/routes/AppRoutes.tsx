import { Route, Routes } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
import DrawingPadPage from "@/pages/Client/DrawingPad";
import HomePage from "@/pages/Client/HomePage";
import MeetingPage from "@/pages/Client/Meeting";
import MiniGamesPage from "@/pages/Client/mini-games";
import Snake from "@/pages/Client/mini-games/snake";
import ProfilePage from "@/pages/Client/Profile";
import SchedulePage from "@/pages/Client/Schedule";
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
							<Route path="profile" element={<ProfilePage />} />
							<Route path="schedule" element={<SchedulePage />} />
							<Route path="mini-games" element={<MiniGamesPage />} />
							<Route path="mini-games/snake" element={<Snake />} />
							<Route path="drawing-pad" element={<DrawingPadPage />} />
							<Route path="meeting" element={<MeetingPage />} />
						</Routes>
					</ClientLayout>
				}
			/>
		</Routes>
	);
}
