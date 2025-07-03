import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

// Accept a token prop (Spotify access token with streaming scope)
export default function MusicPlayer({ token }: { token: string }) {
	const [player, setPlayer] = useState<any>(null);
	const [deviceId, setDeviceId] = useState<string | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);

	useEffect(() => {
		// Load the Spotify Web Playback SDK script
		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;
		document.body.appendChild(script);

		(window as any).onSpotifyWebPlaybackSDKReady = () => {
			const Spotify = (window as any).Spotify;
			const player = new Spotify.Player({
				name: "Web Playback SDK Player",
				getOAuthToken: (cb: (token: string) => void) => {
					cb(token);
				},
				volume: 0.5,
			});

			player.addListener("ready", ({ device_id }: { device_id: string }) => {
				setDeviceId(device_id);
				setIsReady(true);
				console.log("Ready with Device ID", device_id);
			});

			player.addListener(
				"not_ready",
				({ device_id }: { device_id: string }) => {
					setIsReady(false);
					console.log("Device ID has gone offline", device_id);
				},
			);

			player.addListener(
				"initialization_error",
				({ message }: { message: string }) => {
					console.error(message);
				},
			);

			player.addListener(
				"authentication_error",
				({ message }: { message: string }) => {
					console.error(message);
				},
			);

			player.addListener(
				"account_error",
				({ message }: { message: string }) => {
					console.error(message);
				},
			);

			// Listen for player state changes to update isPlaying and hasStarted
			player.addListener("player_state_changed", (state: any) => {
				if (!state) return;
				setIsPlaying(!state.paused);
				if (state.track_window && state.track_window.current_track) {
					setHasStarted(true);
				}
			});

			player.connect();
			setPlayer(player);
		};
	}, [token]);

	// Play a hardcoded track when the play button is clicked
	const playTrack = async () => {
		if (!deviceId) return;
		const trackUri = "spotify:track:4uLU6hMCjMI75M1A2tKUQC"; // Example: Never Gonna Give You Up
		await fetch(
			`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
			{
				method: "PUT",
				body: JSON.stringify({ uris: [trackUri] }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
	};

	// Toggle play/pause using the SDK
	const togglePlayPause = async () => {
		if (!player) return;
		if (!hasStarted) {
			await playTrack();
		} else {
			await player.togglePlay();
		}
	};

	return (
		<Card className="bg-accent">
			<CardHeader className="text-center">
				<div className="bg-gray-400 rounded-2xl size-20 mx-auto mb-2" />
				<CardTitle>Never Gonna Give You Up</CardTitle>
			</CardHeader>
			<CardContent>
				<Slider value={[33]} />
				<div className="text-center mt-4">
					<Button variant={"ghost"}>
						<SkipBack />
					</Button>
					<Button className="rounded-full size-10" onClick={togglePlayPause}>
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
