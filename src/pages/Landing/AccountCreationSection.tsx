import Container from "./Container";
import { AccountCreationForm } from "./forms/account-creation-form";

export default function AccountCreationSection() {
	return (
		<Container>
			<div className="flex flex-col items-center justify-center size-full py-20">
				<p className="text-2xl text-gray-600 font-bold mb-12">
					Account Creation Form
				</p>
				<div className="flex items-center justify-between bg-gradient-to-tr from-blue-100 via-blue-50 to-sky-200 w-5xl h-full rounded-xl px-20 py-16 gap-12 border shadow-lg">
					<div className="flex-1 h-full">
						<AccountCreationForm />
					</div>
					<div className="flex-1 h-full space-y-12 flex flex-col justify-center">
						<p className="text-lg">
							Once you submit the form in the left side someone will call you
							for the confimartion and for the account
						</p>
						<div className="flex flex-col items-end font-medium">
							<p>Or dial the Hotline</p>
							<p>123-123-123</p>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
