export interface User {
	id: string;
	first_name: string;
	last_name: string;
	username: string;
	place_of_assignment: string;
	phone_number: string | null;
	email: string;
	password: string;
	role: string;
	condition: string;
	createdAt: string;
	updatedAt: string;
}
