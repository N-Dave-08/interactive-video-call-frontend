import { Sparkles } from "lucide-react";
import type React from "react";

function MiniGameAnimatedBackground({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{[...Array(15)].map((_, i) => (
					<div
						key={`star-bg-${i + 1}`}
						className="absolute animate-float"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animationDuration: `${3 + Math.random() * 2}s`,
						}}
					>
						<Sparkles
							className="text-white/20"
							size={16 + Math.random() * 16}
						/>
					</div>
				))}
			</div>
			{children}
			<style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
		</div>
	);
}

export { MiniGameAnimatedBackground };
