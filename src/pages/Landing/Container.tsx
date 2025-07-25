import type React from "react";

interface ContainerProps {
	children: React.ReactNode;
	className?: string;
}

export default function Container({
	children,
	className = "",
}: ContainerProps) {
	return (
		<div className={`max-w-7xl mx-auto px-6 lg:px-8 ${className}`}>
			{children}
		</div>
	);
}
