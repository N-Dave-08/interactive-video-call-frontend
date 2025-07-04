import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AvatarCharacter from "@/features/avatar-character";
import ClientSidebar from "./sidebars/ClientSidebar";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<ClientSidebar />
			<main className="flex-1">
				<SidebarTrigger />
				{children}
			</main>
			<AvatarCharacter />
		</SidebarProvider>
	);
}
