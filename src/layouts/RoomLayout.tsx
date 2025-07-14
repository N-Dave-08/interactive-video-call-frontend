import type React from "react";
import { AvatarProvider } from "@/context/AvatarContext";
import MusicPlayer from "@/features/music-player";

export default function RoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AvatarProvider>
			<main className="h-screen w-full relative">
				<div className="absolute inset-0 bg-[url(/backgrounds/ocean-waves.jpg)] bg-cover bg-center pointer-events-none z-0" />
				<div className="relative z-10">{children}</div>
				<MusicPlayer className="fixed bottom-4 left-4" />
			</main>
		</AvatarProvider>
	);
}
