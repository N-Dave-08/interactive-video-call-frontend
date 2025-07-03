import {
	Music,
	Pause,
	Play,
	SkipBack,
	SkipForward,
	Volume2,
} from "lucide-react";
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

	return (
		<div
			className={cn(
				"bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 p-3 space-y-3",
				className,
			)}
		>
			<audio
				ref={audioRef}
				src={twinkleSong}
				onEnded={() => setIsPlaying(false)}
			>
				<track kind="captions" />
			</audio>

			{/* Track Info */}
			<div className="text-center space-y-2">
				<div className="bg-indigo-400 rounded-lg size-12 mx-auto flex items-center justify-center">
					<Music className="text-white size-6" />
				</div>
				<div>
					<h4 className="text-sm font-medium text-gray-900 truncate">
						Twinkle Twinkle Little Star
					</h4>
					<p className="text-xs text-gray-600 truncate">Children's Song</p>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="space-y-1">
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
			</div>

			{/* Controls */}
			<div className="flex items-center justify-center space-x-2">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-gray-600 hover:text-gray-900"
				>
					<SkipBack className="h-4 w-4" />
				</Button>

				<Button
					size="icon"
					className="h-10 w-10 bg-indigo-400 hover:bg-indigo-500 text-white rounded-full"
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
			</div>

			{/* Volume Control */}
			<div className="flex items-center space-x-2">
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
			</div>
		</div>
	);
}
