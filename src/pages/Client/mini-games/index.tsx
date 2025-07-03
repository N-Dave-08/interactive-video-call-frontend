import { Bird, Box, Hammer, WormIcon } from "lucide-react";
import { motion, scale } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Card, CardFooter } from "@/components/ui/card";

export default function MiniGames() {
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
			{miniGames.map((item, index) => {
				const Icon = item.icon;
				const slug = item.name.toLowerCase().replace(/\s+/g, "-");

				return (
					<MotionCard
						whileHover="hover"
						initial={{ opacity: 0, y: 50, scale: 0.8 }}
						animate={{
							opacity: 1,
							y: 0,
							scale: 1,
							transition: {
								delay: index * 0.2,
								duration: 0.4,
								ease: "easeOut",
							},
						}}
						className="hover:cursor-pointer relative overflow-hidden"
						key={item.name}
						onClick={() => navigate(`/client/mini-games/${slug}`)}
					>
						<motion.div
							initial="initial"
							animate="initial"
							whileHover="hover"
							variants={{
								initial: { opacity: 0, y: 10 },
								hover: { opacity: 1, y: 0 },
							}}
							className="flex items-center justify-center h-34 z-50 font-extrabold text-2xl text-gray- text-shadow-lg"
						>
							Click to Play
						</motion.div>
						<motion.div
							variants={{
								inital: { scale: 1 },
								hover: { scale: 1.1 },
							}}
							className="size-full absolute inset-0 bg-[url(/flappy-bird-01.jpg)] bg-cover opacity-50"
						/>
						<CardFooter className="justify-between z-50">
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
