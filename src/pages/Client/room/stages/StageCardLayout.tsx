import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StageCardLayoutProps {
	children: ReactNode;
	cardContentClassName?: string;
}

export default function StageCardLayout({
	children,
	cardContentClassName = "",
}: StageCardLayoutProps) {
	return (
		<Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden flex flex-col h-full w-3/4 mx-auto">
			<CardContent
				className={`py-4 px-10 flex-1 flex flex-col justify-between ${cardContentClassName}`}
			>
				{children}
			</CardContent>
		</Card>
	);
}
