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
				// Exclude large files from caching to avoid size issues
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
				globIgnores: [
					"**/videos/**",
					"**/*.mp4",
					"**/*.mov",
					"**/*.avi",
					"**/*.webm",
					"**/backgrounds/**", // Exclude all background images
					"**/*.jpg", // Exclude all JPEG files which can be large
					"**/*.jpeg",
					"**/assets/**/*.jpg",
					"**/assets/**/*.jpeg",
					"**/assets/**/*.mp3", // Exclude audio files
					"**/ai-voiced/**",
					"**/sound-effects/**",
				],
				maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // Increased to 10MB for other assets
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
	// Ensure static files are properly served in production
	build: {
		rollupOptions: {
			external: [],
		},
		assetsInlineLimit: 0, // Don't inline any assets, serve them as separate files
	},
	// Configure dev server for proper video serving
	server: {
		fs: {
			allow: [".."],
		},
	},
});
