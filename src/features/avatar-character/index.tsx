import { useQuestionStore } from "@/store/questionStore";
import { TutorialCharacter } from "./character";

export interface AvatarCharacterProps {
	message?: string;
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
	const question = useQuestionStore((s) => s.question);
	return (
		<div className="pointer-events-auto">
			<TutorialCharacter
				name={""}
				avatar="😃"
				color="bg-indigo-300"
				message={message ?? question}
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
	);
}
