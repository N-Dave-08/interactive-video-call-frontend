import { SectionCards } from "@/components/cards/SectionCards";
import ClientLayout from "@/layouts/ClientLayout";

export default function HomePage() {
	return (
		<ClientLayout>
			<div className="flex w-full">
				<div className="flex-1">
					<SectionCards />
				</div>
				<div className="flex justify-end w-1/5 mr-4">
					<div className="w-full">
						<p>Background Image</p>
					</div>
				</div>
			</div>
		</ClientLayout>
	);
}
