import type React from "react";
import AvatarCharacter from "@/features/avatar-character";

export default function RoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="h-screen w-full relative">
			<div className="absolute inset-0 bg-[url(/backgrounds/rainbow.jpg)] bg-cover bg-center opacity-60 pointer-events-none" />
			{children}
			<AvatarCharacter />
		</main>
	);
}
