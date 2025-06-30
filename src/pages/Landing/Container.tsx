import type React from "react";

export default function Container({
	children,
	index = 0,
}: {
	children: React.ReactNode;
	index?: number;
}) {
	const bgClass =
		index % 2 === 0
			? "bg-white"
			: "bg-bg-primary bg-gradient-to-tr from-primary via-blue-300 to-purple-400";
	return (
		<section className={`${bgClass} flex items-center justify-center h-screen`}>
			<div className="max-w-6xl size-full">{children}</div>
		</section>
	);
}
