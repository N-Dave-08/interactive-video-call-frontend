import { SectionCards } from "@/components/cards/SectionCards";

export default function Dashboard() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 ">
					<SectionCards />
				</div>
			</div>
		</div>
	);
}
