import Character from "./character";
import { SpeechBubble } from "./speech-bubble";

export default function AvatarCharacter() {
	return (
		<div className="flex items-center gap-4 fixed z-50 bottom-8 right-8">
			<SpeechBubble tailPosition="right" tailOffset="end">
				<p>{"Hello! Lorem Ipsum wakn daisuIUWbhei dasb."}</p>
			</SpeechBubble>
			<Character />
		</div>
	);
}
