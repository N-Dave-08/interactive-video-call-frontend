import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/layouts/AppLayout";
import RoomLayout from "@/layouts/RoomLayout";
import AdminDashboard from "@/pages/Admin/dashboard";
import UsersPage from "@/pages/Admin/users";
import LoginPage from "@/pages/Auth/login";
import RegisterPage from "@/pages/Auth/register";
import DrawingPadPage from "@/pages/Client/DrawingPad";
import ClientDashboard from "@/pages/Client/dashboard";
import MiniGamesPage from "@/pages/Client/mini-games";
import Snake from "@/pages/Client/mini-games/snake";
import ProfilePage from "@/pages/Client/Profile";
import Room from "@/pages/Client/room";
import SchedulePage from "@/pages/Client/Schedule";
import SessionsPage from "@/pages/Client/sessions";
import SessionDetailPage from "@/pages/Client/sessions/session-detail";
import LandingPage from "@/pages/Landing";

const DashboardRoute = () => {
	const { user } = useAuth();
	if (!user) return <Navigate to="/login" />;
	if (user.role === "admin") return <AdminDashboard />;
	return <ClientDashboard />;
};

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route
				path="/room"
				element={
					<ProtectedRoute>
						<RoomLayout>
							<Room />
						</RoomLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/room/:session_id"
				element={
					<ProtectedRoute>
						<RoomLayout>
							<Room />
						</RoomLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				element={
					<ProtectedRoute>
						<AppLayout />
					</ProtectedRoute>
				}
			>
				<Route path="dashboard" element={<DashboardRoute />} />
				<Route path="profile" element={<ProfilePage />} />
				<Route path="schedule" element={<SchedulePage />} />
				<Route path="mini-games" element={<MiniGamesPage />} />
				<Route path="mini-games/snake" element={<Snake />} />
				<Route path="drawing-pad" element={<DrawingPadPage />} />
				<Route path="sessions" element={<SessionsPage />} />
				<Route path="sessions/:sessionId" element={<SessionDetailPage />} />
				<Route path="/users" element={<UsersPage />} />
			</Route>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
		</Routes>
	);
}
