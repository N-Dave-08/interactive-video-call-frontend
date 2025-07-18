import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
			},
			manifest: {
				name: "Interactive Video Call",
				short_name: "VideoCall",
				description: "Your app description here",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				start_url: "/",
				icons: [
					{
						src: "/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}) as any,
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
