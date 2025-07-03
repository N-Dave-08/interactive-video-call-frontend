import { Bird, Box, Hammer, WormIcon } from "lucide-react";
import { motion, scale } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Card, CardFooter } from "@/components/ui/card";

export default function MiniGamesPage() {
	const navigate = useNavigate();
	const MotionCard = motion(Card);

	const miniGames = [
		{ name: "Flappy Bird", icon: Bird },
		{ name: "Snake", icon: WormIcon },
		{ name: "Geometry Dash", icon: Box },
		{ name: "Whack-a-Mole", icon: Hammer },
	];

	return (
		<div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
			{miniGames.map((item) => {
				const Icon = item.icon;
				const slug = item.name.toLowerCase().replace(/\s+/g, "-");

				return (
					<MotionCard
						whileHover="hover"
						initial="initial"
						animate="initial"
						className="hover:cursor-pointer relative overflow-hidden"
						key={item.name}
						onClick={() => navigate(`/client/mini-games/${slug}`)}
					>
						<motion.div
							variants={{
								initial: { opacity: 0 },
								hover: { opacity: 1 },
							}}
							className="absolute inset-0 bg-black/40 z-40"
						/>
						<motion.div
							variants={{
								inital: { scale: 1 },
								hover: { scale: 1.1 },
							}}
							className="size-full absolute inset-0 bg-[url(/flappy-bird-01.jpg)] bg-cover z-20"
						/>
						<motion.div
							variants={{
								initial: { opacity: 0, y: 10 },
								hover: { opacity: 1, y: 0 },
							}}
							className="flex items-center justify-center h-34 font-extrabold text-2xl text-secondary text-shadow-lg z-50"
						>
							Click to Play
						</motion.div>

						<CardFooter className="justify-between z-50 text-secondary">
							<p className="font-bold text-gray- text-shadow-lg">{item.name}</p>
							<div className="rounded-full bg-secondary/40 p-2">
								<Icon className="size-5" />
							</div>
						</CardFooter>
					</MotionCard>
				);
			})}
		</div>
	);
}
