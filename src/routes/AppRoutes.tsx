import { Route, Routes } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
import RoomLayout from "@/layouts/RoomLayout";
import Dashboard from "@/pages/Client/Dashboard";
import DrawingPadPage from "@/pages/Client/DrawingPad";
import MiniGamesPage from "@/pages/Client/mini-games";
import Snake from "@/pages/Client/mini-games/snake";
import ProfilePage from "@/pages/Client/Profile";
import Room from "@/pages/Client/Room";
import SchedulePage from "@/pages/Client/Schedule";
import SessionsPage from "@/pages/Client/Sessions";
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
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="profile" element={<ProfilePage />} />
							<Route path="schedule" element={<SchedulePage />} />
							<Route path="mini-games" element={<MiniGamesPage />} />
							<Route path="mini-games/snake" element={<Snake />} />
							<Route path="drawing-pad" element={<DrawingPadPage />} />
							<Route path="sessions" element={<SessionsPage />} />
						</Routes>
					</ClientLayout>
				}
			/>
			<Route
				path="/client/room"
				element={
					<RoomLayout>
						<Room />
					</RoomLayout>
				}
			/>
		</Routes>
	);
}
