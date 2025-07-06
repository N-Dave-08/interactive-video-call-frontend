import { useState } from "react";
import { TutorialCharacter } from "./character";

export default function AvatarCharacter() {
	const positions = [
		"top-10", // Top
		"left-20", // Left
		"right-10", // Right
		"bottom-10", // Bottom center
	];
	const [screenPosition, setScreenPosition] = useState(0);

	const handleNext = () => {
		setScreenPosition((prev) => (prev + 1) % positions.length);
	};

	return (
		<div className={`absolute ${positions[screenPosition]}`}>
			<TutorialCharacter
				name={""}
				avatar="😃"
				color="bg-indigo-300"
				message={"Hello! Let's have some fun together."}
				type="hint"
				bubblePosition={"left"}
				size={"2xl"}
				showNext={true}
				onNext={handleNext}
				showHint={true}
				delay={200}
			/>
		</div>
	);
}
