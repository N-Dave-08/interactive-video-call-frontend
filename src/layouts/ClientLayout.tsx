import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ClientSidebar from "./sidebars/ClientSidebar";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<ClientSidebar />
			<main>
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	);
}
