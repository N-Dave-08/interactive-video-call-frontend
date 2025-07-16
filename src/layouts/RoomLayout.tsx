import type React from "react";
import { useState } from "react";
import { AvatarProvider } from "@/context/AvatarContext";
import ChangeBackgroundBox from "@/features/ChangeBackgroundBox";
import MusicPlayer from "@/features/music-player";

export default function RoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [bgUrl, setBgUrl] = useState("/backgrounds/stars-lights-bg.jpg");
	return (
		<AvatarProvider>
			<main className="h-screen w-full relative">
				<div
					className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
					style={{ backgroundImage: `url(${bgUrl})` }}
				/>
				<div className="relative z-10">{children}</div>
				<MusicPlayer className="fixed bottom-4 left-4" />
				<ChangeBackgroundBox currentBg={bgUrl} setBgUrl={setBgUrl} />
			</main>
		</AvatarProvider>
	);
}
