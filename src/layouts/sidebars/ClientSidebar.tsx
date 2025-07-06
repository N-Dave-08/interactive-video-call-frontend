import {
	Calendar,
	Gamepad,
	HeartHandshake,
	LayoutDashboard,
	LibraryBig,
	Pencil,
	User,
} from "lucide-react";
import { useState } from "react";
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
import { ChangeBackgroundSidebar } from "@/features/sidebar/change-background-sidebar";
import MusicPlayerSidebar from "@/features/sidebar/music-player-sidebar";

// Menu items.
const items = [
	{
		title: "Dashboard",
		url: "/client/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Profile",
		url: "/client/profile",
		icon: User,
	},
	{
		title: "Schedule",
		url: "/client/schedule",
		icon: Calendar,
	},
	{
		title: "Mini Games",
		url: "/client/mini-games",
		icon: Gamepad,
	},
	{
		title: "Drawing Pad",
		url: "/client/drawing-pad",
		icon: Pencil,
	},
	{
		title: "Sessions",
		url: "/client/sessions",
		icon: LibraryBig,
	},
];

const data = {
	user: {
		name: "example",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
};

export default function ClientSidebar() {
	const [bgUrl, setBgUrl] = useState("/mountain-01.jpg");
	const location = useLocation();

	return (
		<Sidebar>
			<div
				className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
				style={{ backgroundImage: `url(/backgrounds${bgUrl})` }}
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
								<span className="text-base font-semibold z-50">Prep Play</span>
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
				<ChangeBackgroundSidebar setBgUrl={setBgUrl} currentBg={bgUrl} />
				<MusicPlayerSidebar className="border-none" />
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
