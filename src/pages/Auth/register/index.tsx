import { HeartHandshake } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { AnimatedBackground } from "@/components/backgrounds/animted-background";

export default function RegisterPage() {
	return (
		<div className="relative min-h-svh flex flex-col items-center justify-center p-6 md:p-10">
			<AnimatedBackground />
			<div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
				<a href="/" className="flex items-center gap-2 self-center font-medium">
					<HeartHandshake className="h-8 w-8 text-indigo-400" />
					Prep Play
				</a>
				<RegisterForm />
			</div>
		</div>
	);
}
