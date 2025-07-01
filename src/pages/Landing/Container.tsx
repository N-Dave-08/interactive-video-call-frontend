import type React from "react";

export default function Container({ children }: { children: React.ReactNode }) {
	return (
		<section className="flex items-center justify-center h-screen">
			<div className="max-w-6xl size-full">{children}</div>
		</section>
	);
}
