import type { ReactNode } from "react";
import { MiniGameAnimatedBackground } from "../components/MiniGameAnimatedBackground";

export default function MiniGameLayout({ children }: { children: ReactNode }) {
	return (
		<MiniGameAnimatedBackground>
			<div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center">
				{children}
			</div>
		</MiniGameAnimatedBackground>
	);
}
