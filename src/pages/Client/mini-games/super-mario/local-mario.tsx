import { useEffect, useRef, useState } from "react";
import MiniGameLayout from "../layouts/MiniGameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LocalSuperMario() {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Local Mario game URL (if you download the assets)
	const LOCAL_MARIO_URL = "/mario-game/index.html";
	// Fallback to the hosted version
	const HOSTED_MARIO_URL = "https://openhtml5games.github.io/games-mirror/dist/mariohtml5/";

	useEffect(() => {
		// Focus the iframe when component mounts for better keyboard controls
		if (iframeRef.current) {
			iframeRef.current.focus();
		}

		// Handle iframe load events
		const handleLoad = () => {
			setIsLoading(false);
		};

		const handleError = () => {
			setError("Failed to load Mario game");
			setIsLoading(false);
		};

		const iframe = iframeRef.current;
		if (iframe) {
			iframe.addEventListener('load', handleLoad);
			iframe.addEventListener('error', handleError);
		}

		return () => {
			if (iframe) {
				iframe.removeEventListener('load', handleLoad);
				iframe.removeEventListener('error', handleError);
			}
		};
	}, []);

	const retryLoad = () => {
		setError(null);
		setIsLoading(true);
		// Force iframe reload
		if (iframeRef.current) {
			const currentSrc = iframeRef.current.src;
			iframeRef.current.src = '';
			setTimeout(() => {
				if (iframeRef.current) {
					iframeRef.current.src = currentSrc;
				}
			}, 100);
		}
	};

	return (
		<MiniGameLayout>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-4xl mx-auto"
			>
				<Card className="overflow-hidden shadow-2xl border-0">
					<CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
						<CardTitle className="text-2xl font-bold flex items-center gap-3">
							<span className="text-3xl">🎮</span>
							Super Mario Bros
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="relative bg-black">
							{/* Loading State */}
							{isLoading && (
								<div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
									<div className="text-white text-center">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
										<p>Loading Mario Game...</p>
									</div>
								</div>
							)}

							{/* Error State */}
							{error && (
								<div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
									<div className="text-white text-center p-6">
										<div className="text-4xl mb-4">⚠️</div>
										<p className="mb-4">{error}</p>
										<Button onClick={retryLoad} variant="outline" className="text-white border-white hover:bg-white hover:text-black">
											Retry
										</Button>
									</div>
								</div>
							)}

							{/* Game Instructions */}
							<div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-3 rounded-lg text-sm">
								<div className="font-bold mb-2">Controls:</div>
								<div>🔄 Arrow Keys - Move</div>
								<div>🔄 Space - Jump</div>
								<div>🔄 Enter - Start Game</div>
							</div>
							
							{/* Mario Game Iframe */}
							<iframe
								ref={iframeRef}
								src={HOSTED_MARIO_URL}
								title="Super Mario Bros"
								className="w-full h-[600px] border-0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								style={{
									aspectRatio: "16/9",
									minHeight: "600px"
								}}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Game Tips */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="mt-6"
				>
					<Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
						<CardContent className="p-4">
							<div className="flex items-start gap-3">
								<span className="text-2xl">💡</span>
								<div>
									<h4 className="font-bold text-orange-800 mb-2">Game Tips:</h4>
									<ul className="text-sm text-orange-700 space-y-1">
										<li>• Collect coins and power-ups to increase your score</li>
										<li>• Avoid enemies and dangerous obstacles</li>
										<li>• Try to reach the end of each level</li>
										<li>• Have fun exploring the Mushroom Kingdom!</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>
		</MiniGameLayout>
	);
} 