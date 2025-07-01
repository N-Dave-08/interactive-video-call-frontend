import FlappyBird from "@/features/flappy-bird";
import ClientLayout from "@/layouts/ClientLayout";

export default function MiniGames() {
	return (
		<ClientLayout>
			<p>flappy bird</p>
			<FlappyBird />
		</ClientLayout>
	);
}
