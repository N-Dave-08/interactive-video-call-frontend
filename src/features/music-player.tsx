import { Music, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import twinkleSong from "@/assets/music/twinle-twinkle.mp3";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function MusicPlayer() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

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

	const handleSliderChange = (value: number[]) => {
		const newTime = value[0];
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	return (
		<Card className="bg-accent">
			<CardHeader className="text-center">
				<div className="bg-primary rounded-2xl size-20 mx-auto mb-2 flex items-center justify-center">
					<Music className="text-white" />
				</div>
				<CardTitle>Twinkle Twinkle Little Star</CardTitle>
			</CardHeader>
			<CardContent>
				<audio
					ref={audioRef}
					src={twinkleSong}
					onEnded={() => setIsPlaying(false)}
				>
					<track kind="captions" />
				</audio>
				<Slider
					value={[currentTime]}
					max={duration > 0 ? duration : 1}
					step={0.01}
					onValueChange={handleSliderChange}
				/>
				<div className="text-center mt-4">
					<Button variant={"ghost"}>
						<SkipBack />
					</Button>
					<Button className="rounded-full size-10" onClick={handlePlay}>
						{!isPlaying ? <Play /> : <Pause />}
					</Button>
					<Button variant={"ghost"}>
						<SkipForward />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
