import {
	Calendar,
	HeartHandshake,
	LayoutDashboard,
	LibraryBig,
	Pencil,
	User,
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
		title: "Drawing Pad",
		url: "/drawing-pad",
		icon: Pencil,
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
];

export default function AppSidebar() {
	const location = useLocation();
	const { user } = useAuth();

	const items = user?.role === "admin" ? adminItems : clientItems;

	return (
		<Sidebar>
			<div
				className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none bg-primary"
				// style={{ backgroundImage: `url(/backgrounds${bgUrl})` }}
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

			<SidebarContent>
				{/* gradient */}
				<div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-blue-100/60 pointer-events-none" />
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
						avatar: "/avatars/shadcn.jpg",
					}}
				/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
