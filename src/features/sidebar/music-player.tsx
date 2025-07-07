import {
	ChevronDown,
	ChevronUp,
	Music,
	Pause,
	Play,
	Volume2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import twinkleSong from "@/assets/music/twinle-twinkle.mp3";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function MusicPlayer({ className = "" }) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState([75]);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const setAudioData = () => setDuration(audio.duration || 0);
		audio.addEventListener("loadedmetadata", setAudioData);
		return () => audio.removeEventListener("loadedmetadata", setAudioData);
	}, []);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const updateTime = () => setCurrentTime(audio.currentTime);
		audio.addEventListener("timeupdate", updateTime);
		return () => audio.removeEventListener("timeupdate", updateTime);
	}, []);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = volume[0] / 100;
	}, [volume]);

	const handlePlay = () => {
		if (!audioRef.current) return;
		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
		setIsPlaying(!isPlaying);
	};

	const handleSliderChange = (value: number[]) => {
		const newTime = value[0];
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

	if (!isExpanded) {
		return (
			<motion.div
				className={cn(
					"bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden fixed bottom-4 right-4 z-50 w-14 h-14 p-0 flex items-center justify-center",
					className,
				)}
				layout
				initial={false}
			>
				<audio
					ref={audioRef}
					src={twinkleSong}
					onEnded={() => setIsPlaying(false)}
				>
					<track kind="captions" />
				</audio>
				<motion.div
					className="relative size-10 flex items-center justify-center cursor-pointer"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 300, damping: 20 }}
					onClick={() => setIsExpanded(true)}
				>
					<motion.div
						className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg size-10 flex items-center justify-center"
						animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
						transition={
							isPlaying
								? { duration: 2, repeat: Infinity, ease: "easeInOut" }
								: {}
						}
					>
						<Music className="text-white size-6" />
					</motion.div>
					{isPlaying && (
						<motion.div
							className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg opacity-30"
							animate={{ scale: [1, 1.1, 1] }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
						/>
					)}
				</motion.div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className={cn(
				"bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden fixed bottom-4 right-4 z-50 w-80",
				className,
			)}
			layout
			initial={true}
		>
			<audio
				ref={audioRef}
				src={twinkleSong}
				onEnded={() => setIsPlaying(false)}
			>
				<track kind="captions" />
			</audio>
			<div>
				<motion.div
					key="expanded"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					transition={{ duration: 0.2 }}
					className="p-3 space-y-3"
				>
					<div className="flex justify-between items-center">
						<div className="w-6" /> {/* Spacer */}
						<div className="relative">
							<motion.div
								className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl size-12 flex items-center justify-center shadow-lg"
								animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
								transition={
									isPlaying
										? { duration: 2, repeat: Infinity, ease: "easeInOut" }
										: {}
								}
							>
								<Music className="text-white size-6" />
							</motion.div>
							{isPlaying && (
								<motion.div
									className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-30"
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
								/>
							)}
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 text-gray-600 hover:text-gray-900"
							onClick={() => setIsExpanded(false)}
						>
							<ChevronDown className="h-3 w-3" />
						</Button>
					</div>
					<motion.div
						className="text-center space-y-1"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						<h4 className="text-sm font-medium text-gray-900 truncate">
							Twinkle Twinkle Little Star
						</h4>
						<p className="text-xs text-gray-600 truncate">Children's Song</p>
					</motion.div>
					<motion.div
						className="space-y-1"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.15 }}
					>
						<Slider
							value={[currentTime]}
							max={duration > 0 ? duration : 1}
							step={0.01}
							onValueChange={handleSliderChange}
						/>
						<div className="flex items-center justify-between w-full text-xs text-gray-500">
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(duration)}</span>
						</div>
					</motion.div>
					<div className="flex items-center gap-2 w-full">
						<Volume2 className="size-4 text-gray-500" />
						<Slider
							value={volume}
							max={100}
							step={1}
							onValueChange={setVolume}
							className="flex-1"
						/>
					</div>
					<div className="flex items-center justify-center gap-2 pt-2">
						<Button
							size="icon"
							className="h-10 w-10 text-white rounded-full"
							onClick={handlePlay}
						>
							{isPlaying ? (
								<Pause className="h-5 w-5" />
							) : (
								<Play className="h-5 w-5 ml-0.5" />
							)}
						</Button>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}
