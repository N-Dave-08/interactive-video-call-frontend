import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BubblePop from "@/pages/Client/mini-games/bubble-pop";
import FlappyBird from "@/pages/Client/mini-games/flappy-bird";
import GentlePuzzle from "@/pages/Client/mini-games/gentle-puzzle";
import Snake from "@/pages/Client/mini-games/snake";

function getGameName(slug?: string) {
	if (!slug) return "";
	return slug
		.split("-")
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(" ");
}

export default function MiniGameRoute() {
	const { slug, session_id } = useParams();
	const navigate = useNavigate();
	const gameName = getGameName(slug);

	let gameContent = null;
	if (slug === "flappy-bird") {
		gameContent = <FlappyBird />;
	} else if (slug === "snake") {
		gameContent = <Snake />;
	} else if (slug === "gentle-puzzle") {
		gameContent = <GentlePuzzle />;
	} else if (slug === "bubble-pop") {
		gameContent = <BubblePop />;
	} else {
		gameContent = (
			<Card className="p-8 text-center text-2xl font-bold text-gray-500">
				Game not found!
			</Card>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			{/* Minimal header */}
			<div className="flex items-center gap-4 px-6 py-4 bg-transparent fixed top-0 left-0 right-0 z-50">
				<Button
					onClick={() => navigate(`/room/${session_id}?panel=games`)}
					variant="secondary"
				>
					<ArrowLeft className="w-5 h-5 mr-1" />
					Back
				</Button>
				<span className="text-xl font-bold text-white text-shadow-lg">
					{gameName}
				</span>
			</div>
			{/* Centered game content */}
			<div className="flex-1 flex items-center justify-center">
				{gameContent}
			</div>
		</div>
	);
}
