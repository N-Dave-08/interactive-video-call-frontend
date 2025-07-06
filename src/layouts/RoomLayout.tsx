import type React from "react";
import AvatarCharacter from "@/features/avatar-character";
import MusicPlayer from "@/features/sidebar/music-player";

export default function RoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="h-screen w-full relative">
			<div className="absolute inset-0 bg-[url(/backgrounds/ocean-waves.jpg)] bg-cover bg-center opacity-60 pointer-events-none" />
			{children}
			<AvatarCharacter />
			<MusicPlayer className="fixed bottom-4 left-4" />
		</main>
	);
}
