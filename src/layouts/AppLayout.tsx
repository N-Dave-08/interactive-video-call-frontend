import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./sidebars/AppSidebar";

export default function AppLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
				<SidebarTrigger />
				<div className="container mx-auto py-8 px-4">
					<Outlet />
				</div>
			</main>
		</SidebarProvider>
	);
}
