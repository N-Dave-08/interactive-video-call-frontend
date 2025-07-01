export default function BlurBackground() {
	return (
		<div className="fixed h-screen w-full inset-0 -z-10">
			<div
				className="size-96 absolute top-10 left-10"
				style={{
					background:
						"radial-gradient(circle at 60% 40%, #3b82f6 0%, #e0f2fe 100%)",
					filter: "blur(270px)",
				}}
			/>
			<div
				className="size-96 absolute bottom-10 right-10"
				style={{
					background:
						"radial-gradient(circle at 60% 40%, #3b82f6 0%, #e0f2fe 100%)",
					filter: "blur(270px)",
				}}
			/>
		</div>
	);
}
