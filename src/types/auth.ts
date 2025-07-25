export interface LoginResponse {
	success: boolean;
	message: string;
	token: string;
	user: {
		id: string;
		email: string;
		first_name: string;
		last_name: string;
		place_of_assignment: string;
		role: string;
		condition: string;
		profile_picture?: string;
	};
}

export interface RegisterRequest {
	first_name: string;
	last_name: string;
	username: string;
	place_of_assignment: string;
	phone_number: string;
	email: string;
	password: string;
}

export interface RegisterResponse {
	state: string;
	message: string;
	data: {
		id: string;
		role: string;
		condition: string;
		first_name: string;
		last_name: string;
		username: string;
		email: string;
		password: string;
		phone_number: string;
		place_of_assignment: string;
		updatedAt: string;
		createdAt: string;
	};
} 