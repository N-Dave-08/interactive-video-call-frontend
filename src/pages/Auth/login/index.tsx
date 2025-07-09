import { HeartHandshake } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="/" className="flex items-center gap-2 self-center font-medium">
					<HeartHandshake className="h-8 w-8 text-indigo-400" />
					Prep Play
				</a>
				<LoginForm />
			</div>
		</div>
	);
}
