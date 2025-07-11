import { TutorialCharacter } from "./character";

export interface AvatarCharacterProps {
	message: string;
	showNext?: boolean;
	showHint?: boolean;
	onNext?: () => void;
	onHint?: () => void;
	bubblePosition?: "top" | "bottom" | "left" | "right";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function AvatarCharacter({
	message,
	showNext = false,
	showHint = false,
	onNext,
	onHint,
	bubblePosition = "left",
	size = "2xl",
}: AvatarCharacterProps) {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
			style={{ minHeight: "0" }}
		>
			<div className="pointer-events-auto">
				<TutorialCharacter
					name={""}
					avatar="😃"
					color="bg-indigo-300"
					message={message}
					type="hint"
					bubblePosition={bubblePosition}
					size={size}
					showNext={showNext}
					onNext={onNext}
					showHint={showHint}
					onHint={onHint}
					delay={200}
				/>
			</div>
		</div>
	);
}
