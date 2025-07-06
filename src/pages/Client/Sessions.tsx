import { DataTable } from "@/components/ui/data-table";
import data from "@/helpers/data.json";

export default function SessionsPage() {
	return (
		<div>
			<DataTable data={data} />
		</div>
	);
}
