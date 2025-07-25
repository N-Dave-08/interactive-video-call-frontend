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
	profile_picture: string | null;
}

export interface UserQueryParams {
	search?: string;
	role?: string;
	page?: number;
	rowsPerPage?: number;
	condition?: string;
	place_of_assignment?: string;
}

export interface UserStatistics {
	totalUsers: number;
	adminCount: number;
	socialWorkerCount: number;
	newThisWeek: number;
	approvedCount: number;
	approvalRate: number;
	rejectedCount: number;
	blockedCount: number;
	needForApprovalCount: number;
}

export interface UserPagination {
	currentPage: number;
	rowsPerPage: number;
	totalPages: number;
	totalCount: number;
}
