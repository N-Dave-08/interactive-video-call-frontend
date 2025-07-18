import { useTheme } from "next-themes";
import type React from "react";
import { Toaster as Sonner } from "sonner";

const Toaster = (props: React.ComponentProps<typeof Sonner>) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as any}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
