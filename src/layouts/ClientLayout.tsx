import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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
			<main className="flex-1">
				<div className="flex justify-between bg-neutral-200">
					<SidebarTrigger />
					<Button size={"icon"} variant={"ghost"} className="size-7">
						<Menu />
					</Button>
				</div>
				{children}
			</main>
		</SidebarProvider>
	);
}
