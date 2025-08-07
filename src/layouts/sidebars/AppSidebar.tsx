import {
	Calendar,
	HeartHandshake,
	LayoutDashboard,
	LibraryBig,
	User,
	Video,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavUser } from "@/components/nav/ClientNav";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

// Menu items for client
const clientItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Profile",
		url: "/profile",
		icon: User,
	},
	{
		title: "Schedule",
		url: "/schedule",
		icon: Calendar,
	},
	{
		title: "Sessions",
		url: "/sessions",
		icon: LibraryBig,
	},
];

// Menu items for admin
const adminItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Users",
		url: "/users",
		icon: User,
	},
	{
		title: "Sessions",
		url: "/sessions",
		icon: LibraryBig,
	},
	{
		title: "Videos",
		url: "/videos",
		icon: Video,
	},
];

export default function AppSidebar() {
	const location = useLocation();
	const { user } = useAuth();

	const items = user?.role === "admin" ? adminItems : clientItems;

	const bgUrl = "pexels-kseniachernaya-3980609.jpg";

	return (
		<Sidebar>
			<div
				className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
				style={{ backgroundImage: `url(/backgrounds/${bgUrl})` }}
			/>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<div>
								<HeartHandshake className="!size-5 text-primary z-50" />
								<span className="text-base font-semibold z-50">
									{user?.role === "admin" ? "Admin Panel" : "Prep Play"}
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="">
				{/* gradient */}
				<div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/60 to-blue-100/60 pointer-events-none" />
				{/* Menu Tabs */}
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								const isActive = location.pathname.startsWith(item.url);

								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={isActive}>
											<Link to={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: user ? `${user.first_name} ${user.last_name}` : "No name",
						email: user?.email || "no email",
						avatar: user?.profile_picture || "/placeholder.svg",
					}}
				/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
