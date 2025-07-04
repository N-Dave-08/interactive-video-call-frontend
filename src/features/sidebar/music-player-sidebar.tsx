import {
	ChevronDown,
	Music,
	Pause,
	Play,
	SkipBack,
	SkipForward,
	Volume2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import twinkleSong from "@/assets/music/twinle-twinkle.mp3";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function MusicPlayerSidebar({ className = "" }) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState([75]);

	const isFirstRender = useRef(true);

	const [isMinimized, setIsMinimized] = useState(() => {
		const stored = localStorage.getItem("musicPlayerMinimized");
		return stored === "true";
	});

	useEffect(() => {
		isFirstRender.current = false;
	}, []);

	useEffect(() => {
		localStorage.setItem("musicPlayerMinimized", String(isMinimized));
	}, [isMinimized]);

	const handlePlay = () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}

		setIsPlaying(!isPlaying);
	};

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

	return (
		<motion.div
			className={cn(
				"bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden",
				className,
			)}
			layout
			initial={false}
			onClick={() => {
				if (isMinimized) setIsMinimized(false);
			}}
		>
			<audio
				ref={audioRef}
				src={twinkleSong}
				onEnded={() => setIsPlaying(false)}
			>
				<track kind="captions" />
			</audio>
			<div>
				{isMinimized ? (
					<div key="minimized" className="p-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3 flex-1 min-w-0">
								<div className="bg-primary rounded-lg size-8 flex items-center justify-center flex-shrink-0">
									<Music className="text-white size-4" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-xs font-medium text-gray-900 truncate">
										Twinkle Twinkle
									</p>
									<div className="w-full bg-gray-200 rounded-full h-1 mt-1">
										<motion.div
											className="bg-primary h-1 rounded-full"
											initial={{ width: 0 }}
											animate={{ width: `${progressPercentage}%` }}
											transition={{ duration: 0.1 }}
										/>
									</div>
								</div>
							</div>

							<div className="flex items-center space-x-1 flex-shrink-0">
								<Button
									size="icon"
									className="h-8 w-8 text-white rounded-full"
									onClick={(e) => {
										e.stopPropagation();
										handlePlay();
									}}
								>
									{isPlaying ? (
										<Pause className="h-3 w-3" />
									) : (
										<Play className="h-3 w-3 ml-0.5" />
									)}
								</Button>
							</div>
						</div>
					</div>
				) : (
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
							<div className="bg-primary rounded-lg size-12 flex items-center justify-center">
								<Music className="text-white size-6" />
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 text-gray-600 hover:text-gray-900"
								onClick={() => setIsMinimized(true)}
							>
								<ChevronDown className="h-3 w-3" />
							</Button>
						</div>

						{/* Header */}
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

						{/* Progress Bar */}
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
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-gray-500">
								<span>{formatTime(currentTime)}</span>
								<span>{formatTime(duration)}</span>
							</div>
						</motion.div>

						{/* Controls */}
						<motion.div
							className="flex items-center justify-center space-x-2"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-gray-600 hover:text-gray-900"
							>
								<SkipBack className="h-4 w-4" />
							</Button>

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

							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-gray-600 hover:text-gray-900"
							>
								<SkipForward className="h-4 w-4" />
							</Button>
						</motion.div>

						{/* Volume Control */}
						<motion.div
							className="flex items-center space-x-2"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.25 }}
						>
							<Volume2 className="h-4 w-4 text-gray-600" />
							<Slider
								value={volume}
								onValueChange={setVolume}
								max={100}
								step={1}
								className="flex-1"
							/>
							<span className="text-xs text-gray-600 w-8 text-right">
								{volume[0]}%
							</span>
						</motion.div>
					</motion.div>
				)}
			</div>
		</motion.div>
	);
}
