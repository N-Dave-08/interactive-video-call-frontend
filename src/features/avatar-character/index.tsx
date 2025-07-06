import { useState } from "react";
import { TutorialCharacter } from "./character";

export default function AvatarCharacter() {
	const [isBottomRight, setIsBottomRight] = useState(false);

	const handleNext = () => {
		setIsBottomRight(true);
	};

	return (
		<div
			className={
				isBottomRight
					? "fixed bottom-10 right-10 z-50 flex items-end justify-end"
					: "fixed inset-0 flex items-center justify-center z-50"
			}
			style={{ minHeight: "0" }}
		>
			<TutorialCharacter
				name={""}
				avatar="😃"
				color="bg-indigo-300"
				message={"Hello! Let's have some fun together."}
				type="hint"
				bubblePosition={"left"}
				size={isBottomRight ? "md" : "2xl"}
				showNext={true}
				onNext={handleNext}
				showHint={true}
				delay={200}
			/>
		</div>
	);
}
