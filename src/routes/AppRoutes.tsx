import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/layouts/AppLayout";
import AdminDashboard from "@/pages/Admin/dashboard";
import UsersPage from "@/pages/Admin/users";
import VideosPage from "@/pages/Admin/videos";
import LoginPage from "@/pages/Auth/login";
import RegisterPage from "@/pages/Auth/register";
import ClientDashboard from "@/pages/Client/dashboard";
import ProfilePage from "@/pages/Client/Profile";
import Room from "@/pages/Client/room";
import RoomLayout from "@/pages/Client/room/layouts/RoomLayout";
import SchedulePage from "@/pages/Client/schedule";
import SessionsPage from "@/pages/Client/sessions";
import SessionDetailPage from "@/pages/Client/sessions/components/session-detail";
import LandingPage from "@/pages/Landing";
import MiniGameRoute from "../pages/Client/mini-games/components/MiniGameRoute";
import SessionsAdmin from "@/pages/Admin/sessions";

const DashboardRoute = () => {
	const { user } = useAuth();
	if (!user) return <Navigate to="/login" />;
	if (user.role === "admin") return <AdminDashboard />;
	return <ClientDashboard />;
};

export default function AppRoutes() {
	const { user } = useAuth();
	return (
		<Routes>
			<Route
				path="/"
				element={
					<PublicRoute>
						<LandingPage />
					</PublicRoute>
				}
			/>
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
			>
				<Route path="mini-games/:slug" element={<MiniGameRoute />} />
			</Route>
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
				<Route
					path="sessions"
					element={
						user?.role === "admin" ? <SessionsAdmin /> : <SessionsPage />
					}
				/>
				<Route path="sessions/:sessionId" element={<SessionDetailPage />} />
				<Route path="/users" element={<UsersPage />} />
				<Route path="/videos" element={<VideosPage />} />
			</Route>
			<Route
				path="/login"
				element={
					<PublicRoute>
						<LoginPage />
					</PublicRoute>
				}
			/>
			<Route
				path="/register"
				element={
					<PublicRoute>
						<RegisterPage />
					</PublicRoute>
				}
			/>
		</Routes>
	);
}
