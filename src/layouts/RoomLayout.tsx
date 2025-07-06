import type React from "react";
import AvatarCharacter from "@/features/avatar-character";

export default function RoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="h-screen w-full">
			{children}
			<AvatarCharacter />
		</main>
	);
}
