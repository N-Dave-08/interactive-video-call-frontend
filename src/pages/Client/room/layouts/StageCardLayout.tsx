import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StageCardLayoutProps {
	children: ReactNode;
	cardContentClassName?: string;
	cardClassName?: string;
}

export default function StageCardLayout({
	children,
	cardContentClassName = "",
	cardClassName = "",
}: StageCardLayoutProps) {
	return (
		<Card
			className={`bg-white/60 backdrop-blur-sm shadow-2xl border-0 rounded-3xl w-3/4 mx-auto mt-4 mb-4${cardClassName}`}
		>
			<CardContent className={`px-10  ${cardContentClassName}`}>
				{children}
			</CardContent>
		</Card>
	);
}
