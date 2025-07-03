import {
	Calendar,
	Gamepad,
	HeartHandshake,
	Home,
	Pencil,
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
import MusicPlayerSidebar from "@/features/music-player-sidebar";

// Menu items.
const items = [
	{
		title: "Home",
		url: "/client/home",
		icon: Home,
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
		title: "Video Call",
		url: "/client/meeting",
		icon: Video,
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
	const location = useLocation();

	return (
		<Sidebar>
			<div className="absolute inset-0 bg-[url(/mountain-01.jpg)] bg-cover bg-center opacity-60 pointer-events-none" />
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
				<MusicPlayerSidebar className="z-50 border-none" />
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
