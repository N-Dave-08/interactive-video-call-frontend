import { AnimatedBlob } from "./animated-blobs";

export function AnimatedBackground() {
	return (
		<div className="absolute inset-0 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 animate-gradient-move"></div>

			{/* Blobs using Framer Motion */}
			<AnimatedBlob
				size="h-48 w-48"
				color="bg-pink-300"
				position="top-1/4 left-1/4"
				animationDelay={0}
				animationDuration={20}
				animationType="float1"
			/>
			<AnimatedBlob
				size="h-64 w-64"
				color="bg-purple-300"
				position="bottom-1/3 right-1/4"
				animationDelay={2}
				animationDuration={25}
				animationType="float2"
			/>
			<AnimatedBlob
				size="h-40 w-40"
				color="bg-blue-300"
				position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				animationDelay={4}
				animationDuration={18}
				animationType="float3"
			/>
			<AnimatedBlob
				size="h-32 w-32"
				color="bg-yellow-200"
				position="bottom-1/4 left-1/3"
				animationDelay={1}
				animationDuration={22}
				animationType="float1"
			/>
			<AnimatedBlob
				size="h-56 w-56"
				color="bg-green-200"
				position="top-1/3 right-1/3"
				animationDelay={3}
				animationDuration={28}
				animationType="float2"
			/>
		</div>
	);
}
