export interface Activity {
	id: string;
	user: string;
	action: string;
	type: "create" | "registered" | "delete" | "update";
	createdAt: string;
	updatedAt: string;
}
